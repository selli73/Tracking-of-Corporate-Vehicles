;import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
  cors: {
    origin: process.env['FRONTEND_URL']
  }
})
export class FleetMapGateway {

  @WebSocketServer()
  public server: Server;

  @SubscribeMessage('subscribe_to_vehicle')
  handleSubscribe(@MessageBody() data: { vehicleId: string }, @ConnectedSocket() client: Socket) {
    const roomName = `vehicle_${data.vehicleId}`;
    client.join(roomName);
    return {
      event: 'subscribed',
      room: roomName
    };
  }

  broadcastLocation(payload: { vehicleId: string, lat: number, lng: number, speed: number }) {
    this.server.emit('map_update', payload);
    this.server.to(`vehicle_${payload.vehicleId}`).emit('vehicle_telemetry', payload);
  }

  broadcastAlert(alert: { vehicleId: string, message: string, timestamp: string }) {
    this.server.emit('security_alert', alert);
  }
}
