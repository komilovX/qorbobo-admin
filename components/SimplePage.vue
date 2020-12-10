<template>
  <div class="dashboard-editor-container">
    <div>
      <img src="/gifs/bear.gif" class="emptyGif">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return{

    }
  },
}
</script>

<style lang="scss" scoped>
  .emptyGif {
    display: block;
    width: 55%;
    margin: 0 auto
  }

  .dashboard-editor-container {
    background-color: #D8E6CC;
    min-height: calc(100vh - 50px);
    padding: 50px 60px 0px;
    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }
    .info-container {
      position: relative;
      margin-left: 190px;
      height: 150px;
      line-height: 200px;
      .display_name {
        font-size: 48px;
        line-height: 48px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }
</style>
