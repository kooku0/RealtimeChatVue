<template>
    <div id="main">
      <div id="chat">
        <!-- chat area -->
          <div 
            v-for="(item, index) in messages"
            v-bind:class="chatClassName(item)"
            :key="index">
            {{messageFunc(item)}}
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
      messages: [],
      socket : io('localhost:3001')
    }
  },
  methods: {
    chatClassName: (item) => {
      if (item.name === 'me') return 'me'
      else if (item.type === 'connect') return 'connect'
      else if (item.type === 'disconnect') return 'disconnect'
      else return 'other'
    },
    messageFunc: (item) => {
      if (item.type === 'message' && item.name !== 'me') return item.name + ": "+item.message
      else return item.message
    },
    handlePress: (e) => {
      if (e.key === 'Enter') {
        this.sendMessage()
      }
    },
    sendMessage: () => {
      this.messages = [...this.messages, {type: 'message', name: 'me', message: this.message}]
      this.socket.emit('message', {
        type: 'message',
        message: this.message
      })
      this.message = ''
    }
  },
  mounted() {
    this.socket.emit('newUser')
    this.socket.on('update', (data) => {
        console.log(data)
        let message = {...data}
        this.messages = [...this.messages, data]
      }
    )
  },
  created() {
    
  }
}
</script>
