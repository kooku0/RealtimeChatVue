<template>
    <div id="main">
      <div id="chat">
        <!-- chat area -->
          <div 
            v-for="(item, index) in messages"
            v-bind:class="item.name"
            :key="index">
            {{item.message}}
          </div>
      </div>
      <div>
        <input
          type="text"
          id="test"
          placeholder="message.."
          v-model="message"
          v-on:keydown="handlePress"
        />
        <button v-on:click="sendMessage">Submit</button>
      </div>
    </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'HelloWorld',
  data() {
    return {
      message: '',
      messages: [{type: "message", name: "me", message: "hello" }, {type: "message", name: "other", message: "1: hello" }],
      socket : io('localhost:3001')
    }
  },
  methods: {
    handlePress (e) {
      if (e.key === 'Enter') {
        this.sendMessage()
      }
    },
    sendMessage () {
      this.socket.emit('message', {
        type: 'message',
        message: this.message
      })
      console.log(this.message)
      this.message = ''
    }
  },
  mounted() {
    this.socket.emit('newUser')
    this.socket.on('update', (data) => {
        console.log('update')
        let message = {...data}
        this.messages = [...this.messages, data]
      }
    )
  },
  created() {
    
  }
}
</script>
