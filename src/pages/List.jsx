import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import PageTitle from "../components/PageTitle";
import Row from "../components/Row";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Cards from "../components/Cards";
import Tables from "../components/Tables";
import ConfirmationModal from "../components/Confirmation";
import Modal from "../components/Modal";
import Col from "../components/Col";
import { backendUrl } from "../App";
import axios from "axios";

const List = () => {
  const url = backendUrl + "/backend/api/products";
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenConfirmation, setModalOpenConfirmation] = useState(false);
  const breadcrumbItems = [{ label: "Products" }, { label: "Manage Products" }];
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const openModalConfirmation = () => {
    setModalOpenConfirmation(true);
    closeModal();
  };
  const closeModalConfirmation = () => setModalOpenConfirmation(false);
  const columns = [
    { Header: "Img", accessor: "img" },
    { Header: "Name", accessor: "name" },
    { Header: "Price", accessor: "price" },
    { Header: "Best Seller", accessor: "best" },
  ];
  const [dataTable, setDataTable] = useState([]);
  const [dataApi, setDataApi] = useState([]);

  const fecthData = async () => {
    let result = [];
    try {
      console.log("masuk fetch");
      let response = await axios.get(url);

      console.log("response: ", response);
      if (response.data.success) {
        let data = response.data.data;
        setDataApi(data);

        data.forEach(async (data1) => {
          const encodedPath = encodeURIComponent(data1.img[0]);
          let imgThum = backendUrl + "/api/image?fullPath=" + encodedPath;
          let bes = "N";
          if (data1.best) bes = "Y";

          let tmp = {
            img: <img className="w-20 " src={imgThum} alt="Upload Area" />,
            name: data1.name,
            price: data1.price,
            best: bes,
            action: (
              <Row>
                Col
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Button onClick={() => updateModal(data1.id)}>Update</Button>
                </Col>
                <Col xs={12} sm={6} md={4} lg={3}>
                  <Button
                    variant="danger"
                    onClick={() => deleteModal(data1.id)}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            ),
          };

          result.push(tmp);
        });
      }
      setDataTable(result);
    } catch (error) {
      // if (!toast.isActive(toastIdError.current)) {
      //   toastIdError.current = toast.error("Error: " + error.message);
      // }
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {}, [dataApi, dataTable]);
  useEffect(() => {
    fecthData();
  }, []);
  return (
    <div className="flex flex-col w-full gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <PageTitle title="Manage Product" />
      <Row className="justify-end">
        <Button>
          <FontAwesomeIcon icon={faCirclePlus} /> Add New Product
        </Button>
      </Row>
      <Cards>
        <Tables columns={columns} data={dataTable} />
      </Cards>
      {/* <ConfirmationModal
        isOpen={isModalOpenConfirmation}
        onClose={closeModalConfirmation}
      /> */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        header={`Test Product`}
        maxWidth="max-w-xl"
        closeButton={false}
        closeOnOutsideClick={false}
      >
        <form className="flex flex-col w-full items-start gap-3">
          <Row className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Category Name
            </p>

            <input
              className="w-full max-w-[500px] px-3 py-2 "
              type="text"
              placeholder="Type here"
              required
            />
          </Row>
          <Row className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
          </Row>
          <Row className="justify-center w-full">
            <Col xs={12} sm={6} md={4} lg={3}>
              <Button size="lg" variant="danger" onClick={closeModal}>
                Cancel
              </Button>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Button size="lg" onClick={openModalConfirmation}>
                Submit
              </Button>
            </Col>
          </Row>
        </form>
      </Modal>
    </div>
  );
};

export default List;
