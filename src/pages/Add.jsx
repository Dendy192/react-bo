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
import {
  faCirclePlus,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { backendUrl } from "../App";
import axios from "axios";
import Select from "react-select";
import VariantTable from "../components/VariantTable";
import Modal from "../components/Modal";
import ConfirmationModal from "../components/Confirmation";

const Add = () => {
  const url = backendUrl + "/backend/api/products";
  const toastId = React.useRef(null);
  const toastIdError = React.useRef(null);

  const [isLoadingVideo, setIsLoadingVideo] = useState(false); // Video loading spinner

  const [isOpenPreview, setIsOpenPreview] = useState(false);

  const [imageUrls, setImageUrls] = useState([]);

  const [buttonAction, setButtonAction] = useState(true);
  const [closeButton, setCloseButton] = useState(false);

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [vidDuration, setVidDuration] = useState(null);
  const [tmpVideo, setTmpVideo] = useState(null);
  const [viewVideo, setViewVideo] = useState(null);
  const openPreview = () => setIsOpenPreview(true);
  const closePreview = () => {
    setTmpVideo(null);
    setButtonAction(true);
    setCloseButton(false);
    setIsOpenPreview(false);
  };
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productBest, setProductBest] = useState(false);
  const [productCat, setProductCat] = useState(null);
  const [productSub, setProductSub] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [tableVariants, setTableVariants] = useState(null);
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
  const onDeleteImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleReplaceImage = (newImage, indexToReplace) => {
    setImages((prevImages) =>
      prevImages.map((image, index) =>
        index === indexToReplace ? newImage : image
      )
    );
  };
  const videoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const videoElement = document.createElement("video");
        videoElement.src = e.target.result;

        videoElement.onloadedmetadata = () => {
          resolve(videoElement.duration); // Resolve with duration in seconds
        };

        videoElement.onerror = () => {
          reject(new Error("Failed to load video metadata"));
        };
      };

      reader.onerror = () => {
        reject(new Error("Failed to read the video file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = async (event) => {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      let sizeVideo = file.size;

      let duration = await videoDuration(file);
      let convertSize = (sizeVideo / Math.pow(1024, 2)).toFixed(2);

      // Check file size (max 30MB)
      if (convertSize >= 30) {
        console.log("File size exceeds 30MB");
        return;
      } else if (duration <= 10.0 || duration >= 60.0) {
        console.log("ini masuk if", duration <= 10.0, duration);
        return;
      } else {
        setViewVideo(URL.createObjectURL(file));
        setTmpVideo(file);
        openPreview();
      }
    }
  };
  const handleConfirmVideo = async () => {
    console.log(tmpVideo);
    let tmp = await videoDuration(tmpVideo);
    let duration = Math.floor(tmp);
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;

    setVidDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    setVideo(tmpVideo);
    setViewVideo(URL.createObjectURL(tmpVideo));

    closePreview();
  };

  const handleViewVideo = async () => {
    setViewVideo(URL.createObjectURL(video));
    setButtonAction(false);
    setCloseButton(true);
    openPreview();
  };

  const onDeleteVideo = () => {
    setVideo(null);
    setTmpVideo(null);
    setViewVideo(null);
    setVidDuration(null);
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
    setDataVariants((prevVariants) => {
      const updatedVariants = prevVariants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      );

      return updatedVariants;
    });
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
    console.log("awal ", dataVariants);
    let result = await Promise.all(
      dataVariants.map(async (variant) => {
        try {
          if (variant.img === "") {
            console.log("masuk if");
            console.log(variant.name);
            return {
              img: "",
              name: variant.name,
              sizeStock: variant.sizeStock,
              kode: variant.kode,
            };
          } else {
            const base64 = await convertToBase64(variant.img);
            return {
              img: base64,
              name: variant.name,
              sizeStock: variant.sizeStock,
              kode: variant.kode,
            };
          }
        } catch (error) {
          console.log("error: ", error);
          return null; // Skip this variant if conversion fails
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

  useEffect(() => {
    getCategory();
    getSubCategory();
  }, []);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(viewVideo);
    };
  }, [viewVideo]);

  useEffect(() => {}, [
    category,
    subCategory,
    images,
    video,
    vidDuration,
    tmpVideo,
    imageUrls,
    productCat,

    tableVariants,
  ]);
  return (
    <div className="flex flex-col w-full gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <PageTitle title="Add Products" />

      <Cards header="Product">
        {/* <div className="space-y-4"> */}
        <div className="items-start">
          <div className="w-full">
            <p className="mb-2">
              Product Name <span id="mandatory">*</span>
            </p>
            <input
              className="w-full max-w-[500px] px-3 py-2"
              type="text"
              placeholder="Type here"
              required
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <br />
          <p className="mb-2">
            Upload Image {images.length}/6 <span id="mandatory">*</span>
          </p>
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
                  <label
                    key={index}
                    className="relative group"
                    htmlFor={`image${index + 1}`}
                  >
                    <img
                      className="w-20"
                      src={URL.createObjectURL(image)}
                      muted
                      alt=""
                    />
                    <input
                      type="file"
                      id={`image${index + 1}`}
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleReplaceImage(e.target.files[0], index)
                      }
                    />
                    <button
                      className="absolute top-1 right-1 bg-gray-800 bg-opacity-75 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onDeleteImage(index)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-white text-sm"
                      />
                    </button>
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
        <br />
        <p className="mb-2">Upload Video</p>
        <div className="flex gap-2 ">
          {!video ? (
            <div className="flex gap-4">
              <label htmlFor="video" className="cursor-pointer">
                <img className="w-20" src={assets.upload_area} alt="" />
                <input
                  type="file"
                  id="video"
                  accept="video/mp4"
                  hidden
                  multiple
                  onChange={handleVideoChange}
                />
              </label>
              <div className="ml-5">
                <li className="hintVideo">
                  File video maks. harus 30Mb dengan resolusi tidak melebihi
                  1280 x 1280px.
                </li>
                <li className="hintVideo">Durasi: 10-60detik</li>
                <li className="hintVideo">Format: MP4</li>
                <li className="hintVideo">
                  Catatan: Kamu dapat menampilkan produk saat video sedang
                  diproses. Video akan muncul setelah berhasil diproses.
                </li>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="relative group w-40 h-40 border rounded-lg overflow-hidden">
                {isLoadingVideo && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
                  </div>
                )}
                {/* Video Preview */}
                <video
                  className="w-full h-full object-cover"
                  src={viewVideo}
                  onLoadStart={() => setIsLoadingVideo(true)} // Show spinner
                  onCanPlay={() => setIsLoadingVideo(false)} // Hide spinner when ready
                  muted
                />

                {/* Duration Display */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70  text-xs px-2 py-1 rounded">
                  <p className="text-sm text-white">{vidDuration}</p>
                </div>

                {/* Hover Actions */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-x-6 bg-gray-800 bg-opacity-75 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="text-white hover:text-blue-400"
                    onClick={handleViewVideo}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <span className="text-white">|</span>
                  <button
                    className="text-white hover:text-red-400"
                    onClick={onDeleteVideo}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
              <div className="ml-5">
                <li className="hintVideo">
                  File video maks. harus 30Mb dengan resolusi tidak melebihi
                  1280 x 1280px.
                </li>
                <li className="hintVideo">Durasi: 10-60detik</li>
                <li className="hintVideo">Format: MP4</li>
                <li className="hintVideo">
                  Catatan: Kamu dapat menampilkan produk saat video sedang
                  diproses. Video akan muncul setelah berhasil diproses.
                </li>
              </div>
            </div>
          )}
        </div>
        <br />
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
        {/* </div> */}
      </Cards>

      <Cards header="Variants">
        <VariantTable setTableVariants={setTableVariants} />
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
      <Modal
        isOpen={isOpenPreview}
        onClose={closePreview}
        header={"Preview Video"}
        maxWidth="max-w-xl"
        closeButton={closeButton}
        closeOnOutsideClick={false}
      >
        <div className="flex flex-col items-center justify-center space-y-4 p-4 sm:p-6">
          {/* Video Preview */}
          <video
            controls
            className="w-full max-w-md max-h-64 rounded-lg sm:max-h-96"
          >
            <source src={viewVideo} type="video/mp4" />
          </video>

          {/* Action Buttons */}
          {buttonAction && (
            <div className="flex flex-col sm:flex-row justify-end sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4 w-full">
              <button
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={closePreview}
              >
                Cancel
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleConfirmVideo}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Add;
