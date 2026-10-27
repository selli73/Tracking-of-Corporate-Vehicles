;import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { PayloadJwt } from '@app/contracts';


@WebSocketGateway({
  namespace: '/map'
})
export class FleetMapGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(private _jwtService: JwtService, private _configService: ConfigService) {}

  private _logger = new Logger(FleetMapGateway.name);

  @WebSocketServer()
  public server: Server;

  handleConnection(client: Socket) {    
    const { token } = client.handshake.auth;

    if (typeof token !== 'string' || !token) {
      this._logger.warn(`Client ${client.id}: no token`);
      client.disconnect();
      return;
    }

    try {
      const payload: PayloadJwt = this._jwtService.verify(token, { secret: this._configService.getOrThrow('JWT_ACCESS_SECRET') });

      if (payload.role === 'DRIVER') {
        this._logger.warn(`Client ${client.id}: access denied`);
        client.disconnect();
        return;
      }

      client.data.user = payload;
      
      client.join(`company_${payload.companyId}`);
      this._logger.log(`Client with ID: ${client.id} successfully connected. Joined company_${payload.companyId}`);
    } catch(error) {
      this._logger.warn(`Client ${client.id}: invalid token`);
      client.disconnect();
    }
    
  }

  handleDisconnect(client: Socket) {
    this._logger.log(`Client with ID: ${client.id} disconnected successfully`)
  }


  broadcastLocation(event: string, payload: { companyId: string, vehicleId: string, lat: number, lng: number, speed: number, timestamp: string }) {
    this.server.to(`company_${payload.companyId}`).emit(event, payload);
  }
}
