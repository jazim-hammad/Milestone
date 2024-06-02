document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button");
  const uploadButton = document.getElementById("upload-button");
  const fileInput = document.getElementById("file-input");
  const chatGreeting = document.getElementById("chat-greeting");
  const newChatButton = document.getElementById("new-chat-button");
  const chatList = document.getElementById("chat-list");

  // Function to fetch user information and update the greeting
  const updateGreeting = () => {
    // Simulate fetching user information
    const user = { isLoggedIn: true, name: "John Doe" }; // Replace with actual logic
    if (user.isLoggedIn) {
      chatGreeting.textContent = `Hi, ${user.name}, I am your own career guide assistant.`;
    } else {
      chatGreeting.textContent = "Hi, I'm Miles, your career guide assistant.";
    }
  };

  // Function to append messages to the chat
  const appendMessage = (message, sender) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // Function to send messages
  const sendMessage = async (message) => {
    appendMessage(message, "user");

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data && data.response) {
        appendMessage(data.response, "assistant");
      } else {
        appendMessage("Sorry, something went wrong.", "assistant");
      }
    } catch (error) {
      appendMessage("Sorry, something went wrong.", "assistant");
      console.error("There was an error:", error);
    }
  };

  // Function to upload files
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      appendMessage(
        `File uploaded successfully: ${data.filePath}`,
        "assistant"
      );
    } catch (error) {
      appendMessage(
        "Sorry, something went wrong with the file upload.",
        "assistant"
      );
      console.error("There was an error:", error);
    }
  };

  // Event listeners
  sendButton.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (message) {
      sendMessage(message);
      chatInput.value = "";
    }
  });

  chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      sendButton.click();
    }
  });

  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      uploadFile(file);
    }
  });

  newChatButton.addEventListener("click", () => {
    chatMessages.innerHTML = "";
  });

  // Fetch and update greeting on load
  updateGreeting();
});
