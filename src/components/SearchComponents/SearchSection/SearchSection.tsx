"use client";
import { InputComponent } from "../../InputComponent/InputComponent";
import { validateZipCode } from "../../../utils/zipcode.utils.";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZipCodeBox } from "../ZipCodeBox/ZipCodeBox";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface ISearchSectionProps {
  changeSearchInput: (value: string) => void;
}

const randomZipCodes = [
  { zipCode: "90210", county: "Beverly Hills, CA" },
  { zipCode: "60035", county: "Highland Park, IL" },
  { zipCode: "11421", county: "Woodhaven, NY" },
  { zipCode: "38801", county: "Tupelo, MS" },
  { zipCode: "23693", county: "Yorktown, VA" },
  { zipCode: "17011", county: "Camp Hill, PA" },
];

export const SearchSection = (props: ISearchSectionProps) => {
  const searchParams = useSearchParams();
  const zipcode = searchParams.get("zipcode");
  const [searchInput, setSearchInput] = useState(zipcode || "");
  const { toast } = useToast();

  const changeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleZipSearch = () => {
    if (validateZipCode(searchInput)) {
      props.changeSearchInput(searchInput);
    } else {
      toast({
        title: "Invalid ZIP code",
        description: "Please enter a valid ZIP code",
      });
    }
  };

  const selectZipCode = (zipCode: string) => {
    setSearchInput(zipCode);
    props.changeSearchInput(zipCode);
  };

  return (
    <div className="p-4 absolute top-5 z-10 w-1/2 sm:w-1/4">
      <div className="flex items-center space-x-2">
        <InputComponent
          value={searchInput}
          placeholder="Search for US Zip Code"
          onChange={changeSearchInput}
        />
        <Button variant="outline" onClick={handleZipSearch}>
          Go
        </Button>
      </div>
      <div>
        <div className="w-full cursor-pointer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-5">
          {randomZipCodes.map((zip) => (
            <ZipCodeBox
              key={zip.zipCode}
              zipCode={zip.zipCode}
              country={zip.county}
              selectZipCode={selectZipCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
