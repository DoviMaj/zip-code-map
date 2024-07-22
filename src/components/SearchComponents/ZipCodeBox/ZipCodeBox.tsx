"use client";

interface IZIpCodeProps {
  zipCode: string;
  country: string;
  selectZipCode: (zipCode: string) => void;
}

export const ZipCodeBox = (props: IZIpCodeProps) => {
  return (
    <div
      onClick={() => props.selectZipCode(props.zipCode)}
      className="bg-white p-2 rounded shadow-md"
    >
      <p className="text-sm font-semibold">{props.zipCode}</p>
      <p className="text-xs">{props.country}</p>
    </div>
  );
};
