import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import Breadcrumb from "../components/Breadcrumb";
import PageTitle from "../components/PageTitle";
import Cards from "../components/Cards";
import Tables from "../components/Tables";
import Col from "../components/Col";
import Row from "../components/Row";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { backendUrl } from "../App";
import axios from "axios";
import Select from "react-select";

const Add = () => {
  const url = backendUrl + "/backend/api/products";
  const toastId = React.useRef(null);
  const toastIdError = React.useRef(null);
  const [noVariants, setNoVariats] = useState(0);

  const dataTmp = {
    img: "",
    name: "",
    sizeStock: [
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
    kode: "",
  };
  const [dataVariants, setDataVariants] = useState([dataTmp]);
  const [imageUrls, setImageUrls] = useState([]);
  const handleSizeStockChange = (variantIndex, size, value) => {
    const updatedVariants = dataVariants.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          sizeStock: variant.sizeStock.map((item) =>
            item.size === size ? { ...item, stock: parseInt(value) || 0 } : item
          ),
        };
      }
      return variant;
    });

    setDataVariants(updatedVariants);
  };
  // const handleSizeStockChange = (index, size, value) => {
  //   setDataVariants((prevVariants) =>
  //     prevVariants.sizeStock.map((variant, i) =>
  //       i === index
  //         ? {
  //             ...variant,

  //             stock: parseInt(value) || 0,
  //           }
  //         : variant
  //     )
  //   );
  // };
  const customStyles = {
    menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  };
  // dataVariants[noVariants].img !== ""
  // ? URL.createObjectURL(dataVariants[noVariants].img)
  // :
  const tmpTableVariants = {
    img: (
      <>
        <label htmlFor={`imgVariants${noVariants}`}>
          {console.log(
            "ngetest ke refres apa engga ",
            imageUrls[noVariants],
            imageUrls,
            noVariants
          )}

          <img
            className="w-20 cursor-pointer"
            src={imageUrls[noVariants] || assets.upload_area}
            alt="Upload Area"
          />

          <input
            type="file"
            id={`imgVariants${noVariants}`}
            accept="image/*"
            onChange={(e) =>
              handleImageChangeForVariant(noVariants, e.target.files[0])
            }
            hidden
          />
        </label>
      </>
    ),
    name: (
      <input
        placeholder="Input name variants"
        className="px-3 py-2"
        type="text"
        onChange={(e) =>
          handleVariantChange(noVariants, "name", e.target.value)
        }
      />
    ),
    sizeStock: (
      <div className="items-center">
        <Row className="flex items-center space-x-2 mt-4">
          <label htmlFor={`s${noVariants}`}>S</label>
          <input
            id={`s${noVariants}`}
            type="number"
            placeholder="Stock"
            className="px-3 py-2 "
            onChange={(e) =>
              handleSizeStockChange(noVariants, "S", e.target.value)
            }
          />
        </Row>
        <Row className="flex items-center space-x-2 mt-4">
          <label htmlFor={`m${noVariants}`}>M</label>
          <input
            id={`m${noVariants}`}
            type="number"
            placeholder="Stock"
            className="px-3 py-2 "
            onChange={(e) =>
              handleSizeStockChange(noVariants, "M", e.target.value)
            }
          />
        </Row>
        <Row className="flex items-center space-x-2 mt-4">
          <label htmlFor={`l${noVariants}`}>L</label>
          <input
            id={`l${noVariants}`}
            type="number"
            placeholder="Stock"
            className="px-3 py-2 "
            onChange={(e) =>
              handleSizeStockChange(noVariants, "L", e.target.value)
            }
          />
        </Row>
        <Row className="flex items-center space-x-2 mt-4">
          <label htmlFor={`xl${noVariants}`}>XL</label>
          <input
            id={`xl${noVariants}`}
            type="number"
            placeholder="Stock"
            className="px-3 py-2 "
            onChange={(e) =>
              handleSizeStockChange(noVariants, "XL", e.target.value)
            }
          />
        </Row>
        <Row className="flex items-center space-x-2 mt-4 mb-4">
          <label htmlFor={`xll${noVariants}`}>XLL</label>
          <input
            id={`xll${noVariants}`}
            type="number"
            placeholder="Stock"
            className="px-3 py-2 "
            onChange={(e) =>
              handleSizeStockChange(noVariants, "XLL", e.target.value)
            }
          />
        </Row>
      </div>
    ),
    kode: (
      <input
        type="text"
        placeholder="kode"
        className="px-3 py-2 "
        onChange={(e) =>
          handleVariantChange(noVariants, "kode", e.target.value)
        }
      />
    ),
  };

  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productBest, setProductBest] = useState(false);
  const [productCat, setProductCat] = useState(null);
  const [productSub, setProductSub] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [tableVariants, setTableVariants] = useState([tmpTableVariants]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files).filter((file) => file); // Filter out any invalid files
    if (newFiles.length <= 6) {
      setImages((prevImages) => [...prevImages, ...newFiles]); // Append new files to existing images
    } else {
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error("Max Image just 6");
      }
    }
  };
  const breadcrumbItems = [
    { label: "Products" },
    { label: "Manage Products" },
    { label: "Add Products" },
  ];
  const handleImageChangeForVariant = (variantIndex, file) => {
    const updatedImageUrls = [...imageUrls];
    URL.revokeObjectURL(updatedImageUrls[variantIndex]); // Revoke the old URL
    updatedImageUrls[variantIndex] = URL.createObjectURL(file);
    setImageUrls(updatedImageUrls);
    handleVariantChange(variantIndex, "img", file);
  };
  const handleVariantChange = (index, field, value) => {
    setDataVariants((prevVariants) =>
      prevVariants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const addNewVariant = () => {
    setTableVariants((prevVariants) => [...prevVariants, tmpTableVariants]);
    setDataVariants((prevData) => [...prevData, dataTmp]);
    setNoVariats(noVariants + 1);
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  const covertVariant = async () => {
    let result = await Promise.all(
      dataVariants.map(async (variant) => {
        try {
          const base64 = await convertToBase64(variant.img);
          return {
            img: base64,
            name: variant.name,
            sizeStock: variant.sizeStock,
            kode: variant.kode,
          };
        } catch (error) {
          console.log("error: ", error);
          return {
            img: "",
            name: variant.name,
            sizeStock: variant.sizeStock,
            kode: variant.kode,
          }; // Skip this variant if conversion fails
        }
      })
    );
    console.log("resultnya lagi ", result);
    console.log(dataVariants);
    if (result.length === 1 && result[0] === null) {
      return null;
    } else {
      return result;
    }
    // Filter out null values from the result
  };
  const getCategory = async () => {
    let response = await axios.get(url + "/category");
    let data = response.data.data;

    let result = [];
    for (let i = 0; i < data.length; i++) {
      let tmp = {
        value: data[i].name,
        label: data[i].name,
      };
      result.push(tmp);
    }

    setCategory(result);
  };
  const getSubCategory = async () => {
    let response = await axios.get(url + "/subCategory");
    let data = response.data.data;

    let result = [];
    for (let i = 0; i < data.length; i++) {
      let tmp = {
        value: data[i].name,
        label: data[i].name,
      };
      result.push(tmp);
    }

    setSubCategory(result);
  };
  const handleChange = (options) => {
    setProductCat(options || []); // Ensure it sets an empty array if no option is selected
  };
  const handleChange1 = (options) => {
    setProductSub(options || []); // Ensure it sets an empty array if no option is selected
  };
  const addProduct = async () => {
    try {
      if (!productCat || productCat.length === 0) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error("Please Select Category First");
        }
      } else if (!productSub || productSub === 0) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error(
            "Please Select Sub Category First"
          );
        }
      } else {
        const base64Images = await Promise.all(images.map(convertToBase64));
        let variants = await covertVariant();

        let category = [];
        let sub_category = [];

        for (let i = 0; i < productCat.length; i++) {
          category.push({ name: productCat[i].value });
        }

        for (let k = 0; k < productSub.length; k++) {
          sub_category.push({ name: productSub[k].value });
        }

        let productData = {
          name: productName,
          img: base64Images,
          desc: productDesc,
          price: productPrice,
          best: productBest,
          category: category,
          subCategory: sub_category,
          variants: variants,
        };
        console.log(productData);
        let response = await axios.post(url, productData);

        if (response.data.success) {
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.success(response.data.data);
          }
        } else {
          if (!toast.isActive(toastIdError.current)) {
            toastIdError.current = toast.error(response.data.data);
          }
        }
      }
    } catch (error) {
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error(error);
      }
    }
  };

  const columns = [
    { Header: "Thumbnail", accessor: "img" },
    { Header: "Name", accessor: "name" },
    { Header: "Size & Stock", accessor: "sizeStock" }, // Use the formatted field
    { Header: "Kode Variants", accessor: "kode" },
  ];

  const data = [];
  const config = {
    enableSearch: false,
    enablePagination: false,
    enableSorting: false,
    enableEntriesPerPage: false,
  };

  useEffect(() => {
    // let tmp = [];
    // tmp.push(tmpTableVariants);
    // setTableVariants(tmp);
    setNoVariats(noVariants + 1);
    getCategory();
    getSubCategory();
  }, []);

  useEffect(() => {
    console.log(dataVariants);
  }, [
    category,
    subCategory,
    images,
    noVariants,
    imageUrls,
    productCat,
    dataVariants,
    tableVariants,
  ]);
  return (
    <div className="flex flex-col w-full gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <PageTitle title="Add Products" />

      <Cards header="Product">
        <div className="items-start">
          <div className="w-full">
            <p className="mb-2">
              Product Name <span>*</span>
            </p>
            <input
              className="w-full max-w-[500px] px-3 py-2"
              type="text"
              placeholder="Type here"
              required
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <p className="mb-2">Upload Image {images.length}/6</p>
          <div className="flex gap-2">
            {images.length === 0 ? (
              <label htmlFor="image1">
                <img className="w-20" src={assets.upload_area} alt="" />
                <input
                  type="file"
                  id="image1"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <>
                {images.map((image, index) => (
                  <label key={index} htmlFor={`image${index + 1}`}>
                    <img
                      className="w-20"
                      src={URL.createObjectURL(image)}
                      alt=""
                    />
                    <input
                      type="file"
                      id={`image${index + 1}`}
                      accept="image/*"
                      hidden
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                ))}
                {images.length < 6 ? (
                  <label htmlFor={`image${images.length + 1}`}>
                    <img className="w-20" src={assets.upload_area} alt="" />
                    <input
                      type="file"
                      id={`image${images.length + 1}`}
                      accept="image/*"
                      hidden
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </div>

        <div className="w-full">
          <p className="mb-2">Product Description</p>
          <textarea
            className="w-full max-w-[500px] px-3 py-2"
            type="text"
            placeholder="Type here"
            onChange={(e) => setProductDesc(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
          <div>
            <p className="mb-2">Product Category</p>
            <Select
              closeMenuOnSelect={false}
              isMulti
              value={productCat}
              onChange={handleChange}
              options={category}
              menuPlacement="auto" // This can also be set to "top" or "bottom"
              menuPortalTarget={document.body} // Renders the menu in the body
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: 200, // Set a fixed width (adjust as needed)
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "100%", // Match the menu width to the Select container
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: 200, // Set a max height to prevent it from getting too long
                  overflowY: "auto", // Enable scrolling if options exceed max height
                }),
              }}
            />
          </div>
          <div>
            <p className="mb-2">Sub Category</p>
            <Select
              closeMenuOnSelect={false}
              isMulti
              value={productSub}
              onChange={handleChange1}
              options={subCategory}
              menuPlacement="auto" // This can also be set to "top" or "bottom"
              menuPortalTarget={document.body} // Renders the menu in the body
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: 200, // Set a fixed width (adjust as needed)
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "100%", // Match the menu width to the Select container
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: 200, // Set a max height to prevent it from getting too long
                  overflowY: "auto", // Enable scrolling if options exceed max height
                }),
              }}
            />
          </div>

          <div>
            <p className="mb-2">Product Price</p>
            <input
              className="w-full px-3 py-2 sm:w-[120px]"
              type="Number"
              placeholder="Input Price"
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            onChange={(e) => setProductBest(e.target.checked)}
          />
          <label className="cursor-pointer" htmlFor="bestseller">
            Add to bestseller
          </label>
        </div>
      </Cards>
      <Cards header="Variants">
        <Tables columns={columns} data={tableVariants} config={config}></Tables>
        <Button className="mt-4" onClick={addNewVariant}>
          <FontAwesomeIcon icon={faCirclePlus} /> Add another variant
        </Button>
      </Cards>
      <Row className="items-end justify-end">
        <Col>
          <Button size="lg" variant="secondary">
            Cancel
          </Button>
        </Col>
        <Col>
          <Button size="lg" onClick={addProduct}>
            Add Products
          </Button>
        </Col>
      </Row>
      {/* <button
        className="w-28 py-3 mt-4 bg-black text-white"
        type="button"
        onClick={addProduct}
      >
        Add Products
      </button> */}
    </div>
  );
};

export default Add;
