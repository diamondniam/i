import Image from "next/image";

export default function Avatar() {
  return (
    <div className="w-full flex justify-center flex-col items-center gap-2">
      <div className="bg-[var(--background-secondary)] rounded-full">
        <Image
          src="/images/socialAvatar.jpg"
          width={70}
          height={70}
          alt="Avatar"
          className="object-cover rounded-full p-[2px]"
        />
      </div>
    </div>
  );
}
