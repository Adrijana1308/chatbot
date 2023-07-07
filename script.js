 const chatInput = document.querySelector(".chat-input textarea");
 const sendChatBtn = document.querySelector(".chat-input span");
 const chatbox = document.querySelector(".chatbox");
 const chatbotToggler = document.querySelector(".chatbot-toggler");
 const chatbotCloseButton = document.querySelector(".close-btn");

 let userMessage;
 const API_KEY = "";
 const inputHeight = chatInput.scrollHeight;

 const createChatList = (message, className) => {
   const chatList = document.createElement("li");
   chatList.classList.add("chat", className);
   let chatContent = className === "Outgoing" ? `<p></p>`:`<span class="material-symbols-outlined">smart_toy</span><p></p>`;
   chatList.innerHTML = chatContent;
   chatList.querySelector("p").textContent = message;
   return chatList;
}

const generateResponse = (incomingChatLi) => {
   const API_URL = "https://api.openai.com/v1/chat/completions";
   const messageElement = incomingChatLi.querySelector("p");

   const requestOptions = {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
      })
   }

   fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.choices[0].message.content;
   }).catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
   }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
}
	
 const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputHeight}px`;

    chatbox.appendChild(createChatList(userMessage, "Outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      const incomingChatLi = createChatList("Thinking...", "Incoming")
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);
 }

 chatInput.addEventListener("input", () => {
   chatInput.style.height = `${inputHeight}px`;
   chatInput.style.height = `${chatInput.scrollHeight}px`;
 });

 chatInput.addEventListener("keydown", (e) => {
   if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
      e.preventDefault();
      handleChat();
   }
 });

 sendChatBtn.addEventListener("click", handleChat);
 chatbotCloseButton.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
 chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));