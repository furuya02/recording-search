<template>
  <div class="list">
      <table class="table table-hover">
      <thead>
        <tr>
          <th v-for="(header, index) in headers"
            v-bind:key="index">
            {{header}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ctr in ctrList" v-bind:key="ctr.id">
          <td>
            <v-btn dark rounded v-on:click='play(ctr.RecordingLocation)'>playback</v-btn>
          </td>
          <td>{{ctr.ConnectedTimestamp}}</td>
          <td>{{ctr.DisconnectTimestamp}}</td>
          <td>{{ctr.CustomerEndpoint}}</td>
          <td>{{ctr.SystemEndpoint}}</td>
          <td>{{ctr.InitiationMethod}}</td>
          <td>{{ctr.Channel}}</td>
          <td>{{ctr.Queue}}</td>
          <td>{{ctr.AgentName}}</td>
          <td>{{ctr.ContactId}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
    name: 'List',
    props: {
        ctrList: {},
    },
    data() {
        return {
            headers:[
                '再生',
                '開始時間',
                '終了時間',
                '発信番号',
                '着信番号',
                '加入方法',
                'チャンネル',
                'キュー',
                'エージェント',
                'コンタクトID',
            ]
        }
    },
    methods: {
      play(url) {
        this.$emit('parent-play',url); 
      }
    }
}

</script>


