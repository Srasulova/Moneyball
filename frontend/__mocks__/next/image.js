export default function MockImage({ src, alt, width, height, ...props }) {
  return <img src={src} alt={alt} width={width} height={height} {...props} />;
}
