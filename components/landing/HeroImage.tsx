import Image from 'next/image';
import heroImage from '@/public/images/landing/eigyo-navi-hero-fullscreen.jpg';

export default function HeroImage() {
  return (
    // Below `lg`, the crop leaves too little quiet space next to the laptop/cards for
    // an overlay to stay clear of them — true for phones and for a 768-wide portrait
    // tablet alike, since both are governed by width here rather than aspect ratio. So
    // the image is confined to a top band there instead, and the copy lives in the
    // plain, image-free space below it. From `lg` up there is real breathing room, so
    // the box expands back to a full-bleed overlay.
    <div className="hero-image-intro absolute inset-x-0 top-0 h-[38svh] overflow-hidden lg:inset-0 lg:h-full">
      <Image
        src={heroImage}
        alt="営業機会や注目企業を確認できる営業支援ダッシュボード"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[64%_38%] lg:object-[62%_48%] xl:object-[57%_50%]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#F7F9FD] lg:hidden"
      />
    </div>
  );
}
