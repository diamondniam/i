import Image from "next/image";

type AvatarProps = {
  className?: string;
  size?: number;
};

export default function Avatar({ size = 70, className }: AvatarProps) {
  return (
    <div className="w-full flex justify-center flex-col items-center gap-2">
      <div className="bg-[var(--background-secondary)] rounded-full">
        <Image
          src="/images/socialAvatar.jpg"
          width={size}
          height={size}
          alt="Avatar"
          className="object-cover rounded-full p-[2px]"
        />
      </div>
    </div>
  );
}
