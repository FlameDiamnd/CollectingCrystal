import Phaser from "phaser";

export default class CollectingStarsScene extends Phaser.Scene {
  constructor() {
    //menginisialisasi apa yang harus dilakukan pada code selanjutnya
    super("collecting-stars-scene");
  }

  init() {
    this.platforms = []; // Menginisialisasi platforms dengan array kosong
    this.player = undefined;
    this.stars = undefined;
    this.cursor = undefined;
    this.bomb = undefined;

    this.scoreText = undefined;
    this.score = 0;
  }

  collectStar(player, star) {
    //method untuk player bisa mengambil bintang
    star.destroy();
    this.score += 10;
    this.scoreText.setText("Score : " + this.score);
  }

  gameOver(player, bombs) {
    this.physics.pause();
    this.add.text(300, 300, "You death!!!", {
      fontSize: "96px",
    });
  }

  preload() {
    //methode untuk mengupload assets
    this.load.image("sky", "images/sky.png");
    this.load.image("platform", "images/platform.png");
    this.load.image("star", "images/star.png");
    this.load.image("bombs", "images/bomb.png");
    this.load.spritesheet("dude", "images/dude.png", {
      frameWidth: 224 / 7,
      frameHeight: 32,
    });
  }

  create() {
    this.add.image(900, 500, "sky").setScale(1);

    //platforms yang jumlahnya lebih dari 1
    this.platforms = this.physics.add.staticGroup(); //kelas static
    this.platforms.create(100, 150, "platform").setScale(0.9); //cek disini jika bintang jatuh tidak di platforms
    this.platforms.create(1250, 350, "platform");
    this.platforms.create(700, 550, "platform");
    this.platforms.create(500, 720, "platform").setScale(5).refreshBody(); // untuk platforms bawah sekali

    //dude player
    this.player = this.physics.add.sprite(100, 450, "dude").setScale(2);
    this.physics.add.collider(this.player, this.platforms); //agar player bisa memijak platforms

    //Collider Membuat tabrakan antara player dengan platform.

    //stars
    this.stars = this.physics.add.group({
      key: "star",
      repeat: 20,
      setXY: { x: 50, y: 0, stepX: 70 },
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.stars.children.iterate(function (child) {
      // @ts-ignore
      child.setBounceY(0.5);
    });

    //bomb
    this.bombs = this.physics.add.group({
      key: "bombs",
      repeat: 10,
      setXY: { x: 40, y: 0, stepX: 140 },
    });

    this.physics.add.collider(this.bombs, this.platforms);

    //keyboard
    this.cursors = this.input.keyboard.createCursorKeys();

    //membuat player bergerak
    //animation to the left
    this.anims.create({
      key: "left", //--->nama animasi
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 2 }), //--->frame yang digunakan
      frameRate: 10, //--->kecepatan berpindah antar frame
      repeat: -1, //--->mengulangi animasi terus menerus
    });

    //animation idle
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 3 }],
      frameRate: 20,
    });
    //animation to the right
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 4, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    // method collect star agar stars dapat diambil player
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    // method collect star agar bomb dapat diambil player
    this.physics.add.overlap(
      this.player,
      this.bombs,
      this.gameOver,
      null,
      this
    );

    //score
    this.scoreText = this.add.text(16, 16, "Score : 0", {
      fontSize: "32px",
    });
  }

  update() {
    if (this.cursors.left.isDown) {
      //Jika keyboard panah kiri ditekan
      this.player.setVelocityX(-200); // setvelocity kecepatan horizontal
      //Kecepatan x : -200
      //Kecepatan y : 200
      //(bergerak ke kiri dan turun kebawah seolah terkena gaya gravitasi)
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.score >= 100) {
      this.physics.pause();
      this.add.text(300, 300, "Victory", {
        fontSize: "96px",
      });
    }
  }
}
