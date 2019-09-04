function fbAsyncInit() {
  FB.init({
    appId: '131175083982438',
    cookie: true,
    xfbml: true,
    version: 'v2.7',
  });

  FB.login(function(response) {
    if (response.status === 'connected') {
      var canvas = document.querySelector('canvas');
      var ctx = canvas.getContext('2d');

      FB.api('/' + FB.getUserID() + '/picture', {
        height: 500,
        width: 500
      }, function(response) {
        var img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = function() {
          ctx.drawImage(img, 0, 0, 500, 500);
        };
        img.src = response.data.url;
      });

      $('img').draggable({
        containment: 'div',
        scroll: false,
      });

      $('select').change(function() {
        $('button').prop('disabled', false);
        $('.active').removeClass('active');
        $('#' + this.value).addClass('active');
      });

      $('#go').click(function() {
        var profilePos = $('div').eq(0).position();
        var logoPos = $('img.active').eq(0).position();
        ctx.drawImage(
          $('img.active')[0],
          logoPos.left - profilePos.left,
          logoPos.top - profilePos.top,
          200,
          200);

        canvas.toBlob(function(blob) {
          FB.login(function onFBLogin2(response) {
            if (response.status === 'connected') {
              var formData = new FormData();
              formData.append('source', blob);

              $.ajax({
                url: 'https://graph.facebook.com/' + FB.getUserID() + '/photos?access_token=' + FB.getAccessToken(),
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,

                success: function(data) {
                  window.location.href = 'https://m.facebook.com/photo.php?fbid=' + data.id + '&prof=1';
                },
              });
            }
          }, {
            scope: 'publish_actions',
          });
        });
      });
    }
  });
}
