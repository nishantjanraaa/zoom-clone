const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
      // Save message in DB
      await Message.create({
        roomId: data.room,
        sender: data.sender,
        message: data.message
      });

      socket.to(data.room).emit("receive_message", data);
    });
    
    socket.on("join_video", (roomId) => {
  socket.join(roomId);
  socket.to(roomId).emit("user_joined", socket.id);
});

    socket.on("disconnect", () => {
      console.log("❌ User Disconnected");
    });
  });
};
