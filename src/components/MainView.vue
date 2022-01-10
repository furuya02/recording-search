<template>
  <v-app>
    <v-main>
      <v-container>
        <v-layout>
          <h3 class='ma-4'>Amazon Connect 通話一覧</h3>
        </v-layout>
        <v-layout class='ma-10'>
          <v-flex class='pa-3'>
            <DateView @parent-setdate="setDate"/>
          </v-flex>
          <v-flex class='pa-3'>
            <v-select :items='hourList' v-model='hour' label='時間'>'{{hour}}}'</v-select>
          </v-flex>
          <v-flex class='pa-3'>
            <v-select :items='initiationMethodList' v-model='initiationMethod' label='加入方法'>'{{initiationMethod}}'</v-select>
          </v-flex>
          <v-flex class='pa-3'>
            <v-select :items='channelList' v-model='channel' label='チャンネル'></v-select>
          </v-flex>
          <v-flex class='pa-3'>
            <v-select :items='queueList' v-model='queue' label='キュー'></v-select>
          </v-flex>
          <v-flex class='pa-3'>
            <v-select :items='agentNameList' v-model='agentName' label='エージェント'></v-select>
          </v-flex>
          <v-flex class='pa-3'>
            <v-btn color='success' class='ma-3' v-on:click='getList'>検索</v-btn>
          </v-flex>
          <v-flex class='pa-3'>
            <v-btn color='#eeffee' class='ma-3' v-on:click='clear'>検索条件初期化</v-btn>
          </v-flex>
        </v-layout>

        <v-layout>
          <audio :src="audioSrc" controls="" autoplay="" name="media" controlslist="nodownload"></audio>
        </v-layout>

        <v-layout>
          <List v-bind:ctrList='ctrList' @parent-play="play" />
        </v-layout>
        <v-layout>
          <vue-loading v-if="loading" type="spin" color="#333" :size="{ width: '50px', height: '50px' }"></vue-loading>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import List from './List.vue';
import DateView from './DateView.vue';

import { VueLoading } from 'vue-loading-template'

import Amplify, { API } from 'aws-amplify';
import awsconfig from '../aws-exports.js';
Amplify.configure(awsconfig);

export default {
    name: 'MainView',
    components: {
      List,
      DateView,
      VueLoading
    },
    data() {
      return {
        apiName: 'RecordingSearchApi',
        ctrList: [],
        audioSrc: '',
        loading: false,
        date: '',
        initiationMethodList: ['INBOUND','OUTBOUND'],
        initiationMethod : '',
        channelList: ['VOICE','CHAT'],
        channel : '',
        hourList: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        hour : '',
        queueList: ['BasicQueue','InfomationQueue','SalesQueue'],
        queue : '',
        agentNameList: ['agent001','agent002','agent003','agent004','agent005'],
        agentName:''
      }
    },
    methods: {
      async getList() {
          console.log(`date:${this.date}`)
          this.loading = true;
          this.ctrList = [];
          this.audioSrc = '';
          const path = '/recording/list';
          const body = {
            date: this.date,
            hour: this.hour,
            initiationMethod: this.initiationMethod,
            channel: this.channel,
            queue: this.queue,
            agentName: this.agentName,
          };
          try {
              console.log('start query.');
              const ctrList = await API.post(this.apiName, path, {body: body})
              if (ctrList) {
                console.log(`response: ${JSON.stringify(ctrList)}`);
                this.ctrList = ctrList;
              }
          } catch (error) {
              console.error(error)
          }
          this.loading = false;
      },
      clear(){
        this.agentName = '';
        this.hour = '';
        this.initiationMethod = '';
        this.queue = '';
        this.channel = '';
      },
      setDate(date){
        console.log(`parent setDate ${date}`)
        this.date = date;
      },
      async play(url) {
        console.log(url);
        this.loading = true;
        const path = '/recording/audio';
        const body = {
            url: url,
            user: "userName"
          };
        try {
            console.log('start query.');
            const data = await API.post(this.apiName, path, {body: body});
            console.log(data['audioSrc']);
            this.audioSrc = data['audioSrc'];
            this.loading = false;
        } catch (error) {
            console.error(error)
        }
      }
    }
}

</script>


<style scoped lang="scss">
audio { width: 930px; }
</style>
