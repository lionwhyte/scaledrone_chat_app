const drone = new ScaleDrone('hOC8jZBeUxz6QtF9');
const memberName = randomName()
const randomColor = "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";


function randomName() {
  const adjectives = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
  const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

function autoScroll() {
  const $messages = document.getElementById("content");
  const $newMessage = $messages.lastElementChild;

  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeigh = $newMessage.offsetHeight + newMessageMargin;

  const visibleHeight = $messages.offsetHeight;
  const containerHeight = $messages.scrollHeight;

  const scrolloffset = $messages.scrollTop + visibleHeight;
  if (containerHeight - newMessageHeigh <= scrolloffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

function onSubmitForm(event) {
  const contentEl = document.querySelector('.input.content');
  if (contentEl.value) {
    sendMessageToScaleDrone(memberName, contentEl.value, randomColor);
  }
  contentEl.value = '';
}


drone.on('open', function (error) {
  if (error) return console.error(error);

  const room = drone.subscribe('observable-room');

  room.on('open', function (error) {
    if (error) return console.error(error);
    console.log('Connected to room');
  });

  room.on('message', function (message) {
    const member = message.member.id;
    const data = message.data;
    const div = document.createElement('div');

    div.innerHTML = `<div class="member-name" style="backgroundColor: ${data.color}">${data.name}</div><div class="message-content">${data.content}</div>`
    div.classList.add('message');
    document.querySelector('.chat-content').appendChild(div);

    if (drone.clientId === member) {
      div.className = "message my-message";
      div.firstChild.style.textAlign = "right";
      div.lastChild.style.backgroundColor = data.color;

    } else {
      div.lastChild.style.backgroundColor = data.color;
    }
    autoScroll()
  });
});

function sendMessageToScaleDrone(name, content, color) {
  drone.publish({
    room: 'observable-room',
    message: {
      name: name,
      content: content,
      color: color
    }
  });
}












