import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const VariantTable = ({ setTableVariants }) => {
  const [variants, setVariants] = useState([]);

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: "",
        code: "",
        image: null,
        sizes: [
          {
            size: "S",
            stock: 0,
          },
          {
            size: "M",
            stock: 0,
          },
          {
            size: "L",
            stock: 0,
          },
          {
            size: "XL",
            stock: 0,
          },
          {
            size: "XLL",
            stock: 0,
          },
        ],
      },
    ]);
  };

  const handleChange = (id, field, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleImageChange = (id, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setVariants((prev) =>
        prev.map((variant) =>
          variant.id === id ? { ...variant, image: e.target.result } : variant
        )
      );
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSizeStockChange = (id, size, value) => {
    value = value.replace(/^0+/, "");
    if (!value) value = 0;

    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              sizes: variant.sizes.map((s) =>
                s.size === size ? { ...s, stock: value } : s
              ),
            }
          : variant
      )
    );
  };
  // const handleRemoveImage = (id) => {
  //   setVariants((prev) =>
  //     prev.map((variant) =>
  //       variant.id === id ? { ...variant, [field]: value } : variant
  //     )
  //   );
  // };

  const handleRemoveVariant = (idToRemove) => {
    setVariants((prevVariants) =>
      prevVariants.filter((variant) => variant.id !== idToRemove)
    );
  };

  useEffect(() => {
    setTableVariants(variants);
  }, [variants]);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2 text-center">
              Thumbnail
            </th>
            <th className="border border-gray-300 p-2 text-center">Name</th>
            <th className="border border-gray-300 p-2 text-center">
              Variants Code
            </th>
            <th className="border border-gray-300 p-2 text-center">
              Size & Stock
            </th>
            <th className="border border-gray-300 p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.id} className="even:bg-gray-50">
              <td className="border border-gray-300 p-2">
                <div className="flex items-center gap-2 justify-center">
                  {variant.image ? (
                    <div className="relative group">
                      <img
                        className="w-20 cursor-pointer"
                        src={variant.image}
                        alt="Upload Area"
                        onClick={() => {}}
                      />
                      <input
                        type="file"
                        id={`imgVariants${variant.id}`}
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(variant.id, e.target.files[0])
                        }
                        hidden
                      />
                      <button
                        className="absolute top-1 right-1 bg-gray-800 bg-opacity-75 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the file input
                          handleChange(variant.id, "image", null);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-white text-sm"
                        />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor={`imgVariants${variant.id}`}>
                      <img
                        className="w-20 cursor-pointer"
                        src={assets.upload_area}
                        alt="Upload Area"
                      />

                      <input
                        type="file"
                        id={`imgVariants${variant.id}`}
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(variant.id, e.target.files[0])
                        }
                        hidden
                      />
                    </label>
                  )}
                </div>
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center">
                  <input
                    placeholder="Input name variants"
                    type="text"
                    value={variant.name}
                    onChange={(e) =>
                      handleChange(variant.id, "price", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </div>
              </td>

              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  placeholder="Mohon masukkan"
                  value={variant.code}
                  onChange={(e) =>
                    handleChange(variant.id, "code", e.target.value)
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </td>
              <td className="border border-gray-300 p-2">
                {variant.sizes.map((size) => (
                  <div
                    key={size.size}
                    className="flex items-center gap-2 justify-center"
                  >
                    <span className="text-sm font-medium w-6">
                      {size.size}:
                    </span>
                    <input
                      type="number"
                      value={size.stock}
                      onChange={(e) =>
                        handleSizeStockChange(
                          variant.id,
                          size.size,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-2 py-1 text-center w-16"
                    />
                  </div>
                ))}
              </td>
              <td className="border border-gray-300 p-2">
                <div className="flex items-center justify-center">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveVariant(variant.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="mt-4" onClick={handleAddVariant}>
        <FontAwesomeIcon icon={faCirclePlus} /> Add another variant
      </Button>
    </div>
  );
};

export default VariantTable;
