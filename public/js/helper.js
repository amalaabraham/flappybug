const createAligned = (scene, totalWidth, texture, scrollFactor) => {
  let x = 0;
  const w = scene.textures.get(texture).getSourceImage().width;

  const count = Math.ceil(totalWidth / w) * scrollFactor;

  for (let i = 0; i < count; i++) {
    const m = scene.add
      .image(x, scene.scale.height, texture)
      .setOrigin(0, 1)
      .setScrollFactor(scrollFactor);
    m.scale = 0.5;
    x += m.width * 0.5;
  }
};
