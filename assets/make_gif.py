from PIL import Image

image_paths = [
    r"C:\Users\ender\OneDrive\Desktop\frontt-idle\assets\1.png",
    r"C:\Users\ender\OneDrive\Desktop\frontt-idle\assets\2.png",
    r"C:\Users\ender\OneDrive\Desktop\frontt-idle\assets\3.png"
]

base_images = [Image.open(path).convert("RGBA") for path in image_paths]

# Garante que todas tenham o mesmo tamanho
width, height = base_images[0].size
base_images = [img.resize((width, height)) for img in base_images]

frames = []
durations = []

# Configuração de tempo
static_duration = 1500  # tempo que a imagem fica parada (ms)
transition_frames = 15  # número de frames na transição
transition_frame_duration = 40  # tempo de cada frame de transição (ms)

for i in range(len(base_images)):
    current_img = base_images[i]
    next_img = base_images[(i + 1) % len(base_images)]
    
    # Adiciona a imagem estática
    frames.append(current_img)
    durations.append(static_duration)
    
    # Adiciona a transição (fade)
    for step in range(1, transition_frames + 1):
        alpha = step / float(transition_frames)
        blended = Image.blend(current_img, next_img, alpha)
        frames.append(blended)
        durations.append(transition_frame_duration)

output_path = r"C:\Users\ender\OneDrive\Desktop\frontt-idle\assets\banner_animado.gif"

frames[0].save(
    output_path,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    disposal=2
)

print(f"Animated GIF saved to {output_path}")
