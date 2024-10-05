import Phaser from 'phaser'

import CollectingStarsScene from './scenes/CollectingStarsScene';

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 1600,
	height: 700,
	physics: {
		default: 'arcade',
		arcade: {
			mode: "debug",
			gravity: { y: 200 }
		}
	},
	scene: [CollectingStarsScene],
}

export default new Phaser.Game(config)
