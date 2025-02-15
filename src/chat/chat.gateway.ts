import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  path: "/socket"
})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    console.log("Client connected:", socket.id);
  }

  async handleDisconnect(socket: Socket) {
    console.log("Client disconnected:", socket.id);
  }

  @SubscribeMessage("chat-send")
  async sendMessage(socket: Socket, data: any) {
    const { message, senderId } = data;
    console.log("Received message from client:", message);
    this.server.emit("chat-receive", { message, senderId });
    console.log("Broadcasted message to clients:", message);
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: string): void {
    this.server.emit('message', payload);  // Kirim pesan ke semua client
    console.log("Received message from client:", payload);
    console.log("Broadcasted message to clients:", payload);
  }
}