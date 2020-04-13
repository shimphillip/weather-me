const app = new Vue({
  el: '#app',
  data: {
    phoneNumber: '',
    zipcode: 78754,
  },
  methods: {
    processForm: function () {
      const storeUserInfo = firebase.functions().httpsCallable('storeUserInfo');
      storeUserInfo({
        phoneNumber: this.phoneNumber,
        zipcode: this.zipcode,
      })
        .then((data) => console.log('data', data))
        .catch((error) => console.log('error', error));
    },
  },
  async mounted() {
    const getUserInfo = firebase.functions().httpsCallable('getUserInfo');

    const doc = await getUserInfo();
    console.log(doc);
    const { phoneNumber, zipcode } = doc.data;
    this.phoneNumber = phoneNumber;
    this.zipcode = zipcode;
  },
});
