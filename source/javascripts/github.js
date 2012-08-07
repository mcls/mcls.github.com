var github = (function(){
  function render(target, repos){
    var i = 0, fragment = '', t = $(target)[0];

    for(i = 0; i < repos.length; i++) {
      fragment += '<li><a href="'+repos[i].url+'">'+repos[i].name+'</a><p>'+repos[i].description+'</p></li>';
    }
    t.innerHTML = fragment;
  }

  function sortReposByPushedAt(repos) {
    repos.sort(function(a, b) {
      var aDate = new Date(a.pushed_at).valueOf(),
          bDate = new Date(b.pushed_at).valueOf();

      if (aDate === bDate) { return 0; }
      return aDate > bDate ? -1 : 1;
    });
  }

  function filterForks(repos) {
    var notForked = [];
    for (var i = 0; i < repos.length; i++) {
      if (repos[i].fork) { continue; }
      notForked.push(repos[i]);
    }
    return notForked;
  }

  return {
    showRepos: function(options){
      $.ajax({
          url: "https://api.github.com/users/" + options.user + "/repos?callback=?"
        , type: 'jsonp'
        , error: function (err) { $(options.target + ' li.loading').addClass('error').text("Error loading feed"); }
        , success: function(data) {
            var repos = data.data;
            if (!repos) { return; }
            if (options.skip_forks) { repos = filterForks(repos); }
            sortReposByPushedAt(repos);

            if (options.count) { repos.splice(options.count); }
            render(options.target, repos);
          }
      });
    }
  };
})();
