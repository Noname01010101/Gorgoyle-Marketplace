import Link from 'next/link';
import Image from 'next/image';

interface FeatureProps {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function FeatureSection({
  title,
  description,
  linkText,
  linkHref,
  imageSrc,
  imageAlt,
  reverse = false,
}: FeatureProps) {
  return (
    <div className="mb-32">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className={`space-y-6 ${reverse ? 'order-1 md:order-2' : 'order-1'}`}>
          <h2 className="text-5xl font-semibold tracking-tight">{title}</h2>
          <p className="text-xl text-gray-400 leading-relaxed">{description}</p>
          <Link
            href={linkHref}
            className="inline-block text-blue-500 hover:text-blue-400 transition-colors text-lg"
          >
            {linkText} →
          </Link>
        </div>
        <div
          className={`h-80 bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl flex items-center justify-center border border-gray-800 ${
            reverse ? 'order-2 md:order-1' : 'order-2'
          }`}
        >
          <Image src={imageSrc} alt={imageAlt} width={400} height={300} />
        </div>
      </div>
    </div>
  );
}
