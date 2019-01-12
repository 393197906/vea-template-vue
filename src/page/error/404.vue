<template>
  <div>
    <div class="page">
        <div class="error">
          <h1 class="header">
            <a href="" class="logo">
              <!--<img src="@/assets/images/logo_blue.png">-->
            </a>
            404
          </h1>
          <div class="content">
            <p>
              <strong>你似乎来到了没有资源存在的荒原...</strong>
            </p>
            <p>来源链接是否正确？用户是否存在？</p>
            <hr>
            <p>
              <a @click="$router.push('/')">返回首页</a>
              <span class="span">或者</span>
              <a @click="back">返回上一页</a>
            </p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
body {
  margin: 0;
  color: #222;
  font: 16px/1.7 "Helvetica Neue", Helvetica, Arial, Sans-serif;
}

img {
  border: none;
}

a {
  color: #2e7ed9;
  font-weight: 600;
}

a:hover {
  text-decoration: underline;
  text-decoration: none;
  cursor: pointer;
}

.error {
  margin: 169px auto 0;
  width: 404px;
}

.error-wide {
  width: 500px;
}

@media (max-width: 500px) {
  .error {
    width: 98%;
  }
}

.error .header {
  overflow: hidden;
  font-size: 1.8em;
  line-height: 1.2;
  margin: 0 0 0.33em 0.33em;
}

.error .header img {
  vertical-align: text-bottom;
}

.error .header .mute {
  color: #999;
  font-size: 0.5em;
}

.error hr {
  margin: 1.3em 0;
}

.error p {
  margin: 0 0 1.7em;
  color: #999;
}

.error p:last-child {
  margin-bottom: 0;
}

.error strong {
  font-size: 1.1em;
  color: #000;
}

.error .content {
  padding: 2em 1.25em;
  border: 1px solid #babbbc;
  border-radius: 5px;
  background: #f7f7f7;
  text-align: center;
}

.error .content .single {
  margin: 3em 0;
  font-size: 1.1em;
  color: #666;
}

.span {
  padding: 0px 10px;
}
</style>
