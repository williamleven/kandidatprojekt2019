<template>
<div class="game-board">
  <HUD>
    <vue-p5
      @setup="setup"
      @draw="draw"
      @preload="preload"
    ></vue-p5>
  </HUD>
</div>
</template>

<script>
import VueP5 from 'vue-p5'
import Entity from '@/characters/entity'
import HUD from '@/components/HUD'
import { drawHitbox } from '@/utility/graphics'
import HitBox from '@/utility/hitbox'

export default {
  name: 'GameBoard',
  data () {
    return {
      assets: {}, // Graphical assetPaths (sprites)
      fr: 36, // Framerate aim
      board: { // Game board definition
        xTiles: 10, // Width
        yTiles: 15, // Height
        closeHCover: 0.61, // How much of the width the board covers in the close end
        farHCover: 0.35, // How much of the width the board covers in the far end
        start: 0.2, // Where the board starts, given in percentage from the bottom
        end: 0.69, // Where the board ends, given in percentage from the bottom
      },
      mousePos: {
        x: 0,
        y: 0,
      },
      resize: null, // Function that resizes the canvas when the window size changes
    }
  },
  computed: {
    entities: {
      get () {
        return this.$store.getters['getEntities']
      },
      set (entities) {
        this.$store.commit('setEntities', entities)
      },
    },
    obstacles () {
      return this.$store.getters['getLevelObstacles']
    },
  },
  methods: {
    /**
     * The p5.js draw loop
     * Is used as general game loop
     * @param sketch The p5.js sketch object
     */
    draw (sketch) {
      // Reset canvas
      sketch.clear()

      if (process.env.VUE_APP_SHOW_BORDERS === 'true') {
        drawHitbox(sketch, this.board, new HitBox(0.00001, this.board.xTiles - 0.00001, 0.00001, this.board.yTiles - 0.00001))
      }

      // Get the current framerate
      let fr = sketch.getFrameRate()
      // Sometimes the sketch return a 0 framerate, if that's the case, use aim framerate
      fr = fr === 0 ? this.fr : fr

      // Update all entities if the game is running
      if (this.$store.getters['getRunStatus']) {
        try { // Abort if there is an error in the user code
          for (let i = 0; i < this.entities.length; i++) {
            // TODO example of damage dealt
            this.entities[i].update({
              sketch: sketch,
              ticks: 1 / fr,
              board: this.board,
              level: this.$store.getters['getLevel'],
              obstacles: this.obstacles,
              entities: this.entities,
            })
          }
          // Kill dead entities
          this.entities = this.entities.filter(
            (e) => e instanceof Entity && e.health > 0
          )
        } catch (e) {
          this.$store.commit('setRunStatus', false) // Stop game
        }
      }

      // Redraw all entities and obstacles
      let drawables = this.entities.concat(this.obstacles)
      drawables.sort((a, b) => b.y - a.y)

      drawables.forEach(
        (d) => d.groundDraw({
          sketch: sketch,
          assets: this.assets,
          ticks: 1 / fr,
          board: this.board,
        }))
      drawables.forEach(
        (d) => d.draw({
          sketch: sketch,
          assets: this.assets,
          ticks: 1 / fr,
          board: this.board,
        }))
      drawables.forEach(
        (d) => d.airDraw({
          sketch: sketch,
          assets: this.assets,
          ticks: 1 / fr,
          board: this.board,
        }))

      // Check win condition and increase level
      if (this.hasWon()) {
        this.$store.commit('incLevel')
      } else if (this.hasLost()) {
        this.$store.commit('setRunStatus', false)
      }
    },
    /**
     * Check if player has won
     * Returns true if all attackers has reached the far end of the board
     * @return Boolean value
     */
    hasWon () {
      let attackers = this.entities.filter((e) => e.isAttacker)
      return attackers.every((e) => e.y + 0.1 >= this.board.yTiles) && attackers.length > 0
    },
    hasLost () {
      return this.entities.filter((e) => e.isAttacker).length === 0
    },
    /**
     * Run before loading all sketch assetPaths
     * Asynchronously loads all assetPaths
     * @param sketch The p5.js sketch object
     */
    preload (sketch) {
      let assets = [
        'assets/background.png',
      ]

      this.$store.getters['getGameObjects'].forEach(
        (o) => o.assetPaths.forEach((p) => assets.push(p))
      )

      assets.forEach((path) => {
        this.assets[path] = sketch.loadImage(
          path
        )
      })
    },
    /**
     * Run before first draw loop
     * Creates the canvas and sets p5 options
     * @param sketch The p5.js sketch object
     */
    setup (sketch) {
      this.resize = () => sketch.createCanvas(sketch.windowHeight * 0.86, sketch.windowHeight)
      sketch.setFrameRate(this.fr)
      // Cover 100 % of height
      sketch.createCanvas(sketch.windowHeight * 0.86, sketch.windowHeight)
      this.duckHidden = false
    },
    handleResize () {
      if (this.resize !== null) {
        this.resize()
      }
    },
  },
  components: {
    VueP5,
    HUD,
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style lang="scss" scoped>
  .game-board {
    height: 100vh;
    resize: none;
    overflow: hidden;
  }
</style>
