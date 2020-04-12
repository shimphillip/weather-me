const app = new Vue({
  el: '#app',
  data: {
    phoneNumber: '',
    zipcode: 78754,
    time: 'sevenAM',
  },
  methods: {
    // upvoteRequest(id) {
    //   //console.log(id);
    //   const upvote = firebase.functions().httpsCallable('upvote');
    //   upvote({ id }).catch((error) => {
    //     showNotification(error.message);
    //   });
    // },
  },
  async mounted() {
    const docInfo = firebase.functions().httpsCallable('getUserInfo');

    const doc = await docInfo();
    console.log(doc);
    const { phoneNumber, zipcode, time } = doc.data;
    this.phoneNumber = phoneNumber;
    this.zipcode = zipcode;
    this.time = time;
  },
});
