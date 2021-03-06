import Tower from './tower'

export default class StoneTower extends Tower {
  size//= 200

  static name = 'stone-tower' // prototype.name has been buggy
  constructor (x, y, size, initHealth) {
    super(x, y, 0.009 * size, 0.0076 * size, initHealth)
    this.size = size
  }

  imageAnchor = {
    x: 0.62,
    y: 0.74,
  }

  /**
   * The range from the Wooden Tower within which other entities takes damage.
   * @type {number}
   */
  damageRange = 4

  /**
   * The damage made per second when dealing damage.
   * @type {number}
   */
  attackDamage = 15

  getAsset (assets) {
    return assets[StoneTower.assetPaths[0]]
  }

  static assetPaths = [
    'assets/stone-tower.svg',
  ]
}
