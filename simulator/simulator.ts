import 'dotenv';
import { route1, route2, route3, route4 } from './points';
import type { ActiveBooking, Point, Route } from './types';
import credentials from './credentials.json';

function requireEnv(name: string) {
    const value = process.env[name];
    if (!value) {
        console.log(`Не заполнена переменная ${name} в .env`);
        process.exit(1);
    }

    return value;
}

const authEndpoint: string = requireEnv('URL_LOGIN');
const urlSaveLocation: string = requireEnv('URL_SAVE_LOCATION');
const urlReceiveDriverBooking = requireEnv('URL_RECEIVER_DRIVER_BOOKING');

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const routes = [route1, route2, route3, route4];

class Driver {    

    accessToken: string | null = null;
    currentBookingId: string | null = null;
    isTickRunning: boolean = false;
    index: number = 0;

    constructor(private email: string, private password: string, private route: Route) {}

    start() {
        setInterval(() => this.tick(), 2000);
    }

    async login(): Promise<{ access_token: string }> {
        const response = await fetch(authEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.email,
                password: this.password
            })
        });

        if (!response.ok) {
            const body = await response.text();
            throw Error(`Не удалось войти: ${response.status} ${body}`);
        }

        return response.json();
    }

    async authorizedFetch(url: string, method = 'GET', body?: unknown) {
        
        if (!this.accessToken) {
            this.accessToken = (await this.login()).access_token;
        }

        const send = () => {
            const headers: Record<string, string> = { Authorization: `Bearer ${this.accessToken}` };

            if (body !== undefined) headers['Content-Type'] = 'application/json';

            return fetch(url, {
                method,
                headers,
                body: body !== undefined ? JSON.stringify(body) : undefined
            });
        }

        let response = await send();

        if (response.status === 401) {
            this.log('Токен истек, входим заново');
            this.accessToken = (await this.login()).access_token;
            response = await send();
        }

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`${method} ${url}: ${response.status} ${text}`);
        }

        return response;
    }

    async getActiveBooking(): Promise<ActiveBooking | null> {
        const response = await this.authorizedFetch(urlReceiveDriverBooking);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }

    async sendLocation(vehicleId: string, point: Point) {
        await this.authorizedFetch(urlSaveLocation, 'POST', {
            vehicleId,
            lat: point.lat,
            lng: point.lng,
            speed: getRandomInt(1, 60)
        });        
    }       
    
    async tick() {
        if (this.isTickRunning) return; // предыдущий тик ещё не закончился

        this.isTickRunning = true;

        try {
            const booking = await this.getActiveBooking();

            if (!booking) {
                if (this.currentBookingId) {
                    this.log('Поездка завершена, ждём новую бронь');
                    this.currentBookingId = null;
                }
                return;
            }

            if (booking.id !== this.currentBookingId) {
                this.log(`Новая поездка: бронь ${booking.id}, машина ${booking.vehicleId}`);
                this.currentBookingId = booking.id;
                this.index = 0;
            }

            await this.sendLocation(booking.vehicleId, this.route[this.index]);
            this.log(`точка ${this.index}`);
            this.index = (this.index + 1) % this.route.length;
        } catch(error) {
            this.error(`Точка ${this.index}: ошибка ${error}`);
        } finally {
            this.isTickRunning = false;
        }
    }

    log(message: string) {
        console.log(`${this.email} ${message}`);
    }

    error(message: string) {
        console.error(`${this.email} ${message}`);
    }
}

for (const [i, driver] of credentials.entries()) {
    const instance = new Driver(driver.email, driver.password, routes[i % routes.length]);
    instance.start();
}    