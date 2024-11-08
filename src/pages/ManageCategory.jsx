import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Col from "../components/Col";
import Row from "../components/Row";
import Tables from "../components/Tables";
import Cards from "../components/Cards";
import Modal from "../components/Modal";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import ConfirmationModal from "../components/Confirmation";
import Breadcrumb from "../components/Breadcrumb";
import PageTitle from "../components/PageTitle";

const ManageCategory = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenConfirmation, setModalOpenConfirmation] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [dataApi, setDataApi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryName, setCategoryName] = useState("");
  const [categoryStatus, setCategoryStatus] = useState("Y");

  const [modalHeader, setModalHeader] = useState("Add New");
  const [condition, setCondition] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const url = backendUrl + "/backend/api/products/category";
  const openModalConfirmation = () => {
    if (condition === "update") {
      let updatedDataApi = getData().then((res) => res.data.data);
      let copyDataTable = updatedDataApi.find((item) => item.id === categoryId);
      if (
        copyDataTable.name.toLowerCase() === categoryName.toLowerCase() &&
        copyDataTable.status === categoryStatus
      ) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error("Same category data");
        }
        return;
      }
    }
    if (condition === "add") {
      let updatedDataApi = getData().then((res) => res.data.data);
      if (updatedDataApi.length !== 0 && dataApi.length !== 0) {
        if (
          updatedDataApi.find(
            (item) =>
              item.name.toLowerCase() === categoryName.toLocaleLowerCase()
          )
        ) {
          if (!toast.isActive(toastIdError.current)) {
            toastIdError.current = toast.error("Same category data");
          }
          return;
        }
      }
    }
    setModalOpenConfirmation(true);
    closeModal();
  };
  const closeModalConfirmation = () => setModalOpenConfirmation(false);
  const toastId = React.useRef(null);
  const toastIdError = React.useRef(null);

  const columns = [
    { Header: "No", accessor: "no" },
    { Header: "Name", accessor: "name" },
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "action" },
  ];

  const breadcrumbItems = [{ label: "Products" }, { label: "Manage Category" }];
  const getData = async () => {
    let result = await axios.get(url);
    return result;
  };

  const fetchData = async () => {
    let result = [];
    try {
      let response = await getData();

      if (response.data.success) {
        let data = response.data.data;
        setDataApi(data);
        let no = 1;
        data.forEach((data1) => {
          let status = data1.status === "Y" ? "active" : "disabled";
          let tmp = {
            no: no,
            name: data1.name,
            status: status,
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
          no++;
          result.push(tmp);
        });
      }
      setDataTable(result);
    } catch (error) {
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, [dataTable, dataApi, condition]);

  const addData = async () => {
    setModalHeader("Add New");
    setCategoryName("");
    setCategoryId("");
    setCategoryStatus("Y");
    setCondition("add");
    openModal();
  };

  const onSubmitAddData = async () => {
    try {
      let body = {
        name: categoryName,
        status: categoryStatus,
      };
      let response = await axios.post(url, body);
      if (response.data.success) {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success(response.data.data);
        }
      } else {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error(response.data.data);
        }
      }
      fetchData();
    } catch (error) {
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error("Error: " + error.message);
      }
    }
  };

  const onSubmit = (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      switch (condition) {
        case "add":
          onSubmitAddData();
          break;

        case "update":
          onSubmitUpdate();
          break;
        case "delete":
          onSubmitDelete();
          break;
      }

      closeModalConfirmation();
    } catch (error) {
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error("Error: " + error.message);
      }
    }
  };

  const onSubmitUpdate = async () => {
    try {
      let body = {
        id: categoryId,
        name: categoryName,
        status: categoryStatus,
      };
      let response = await axios.put(url, body);
      if (response.data.success) {
        toastId.current = toast.success(response.data.data);
      } else {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error(response.data.data);
        }
      }
      fetchData();
    } catch (error) {
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error("Error: " + error.message);
      }
    }
  };

  const updateModal = async (id) => {
    let updatedDataApi = await getData().then((res) => res.data.data);
    let copyDataTable = updatedDataApi.find((item) => item.id === id);

    setModalHeader("Update");
    setCategoryName(copyDataTable.name);
    setCategoryId(id);
    setCategoryStatus(copyDataTable.status);
    setCondition("update");
    openModal();
  };

  const deleteModal = async (id) => {
    setCategoryId(id);
    setCondition("delete");
    openModalConfirmation();
  };

  const onSubmitDelete = async () => {
    try {
      let response = await axios.delete(url + "/" + categoryId);
      if (response.data.success) {
        toastId.current = toast.success(response.data.data);
      } else {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error(response.data.data);
        }
      }
      fetchData();
    } catch (error) {
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error("Error: " + error.message);
      }
      setLoading(false);
    }
  };
  if (loading) return <Loading />;
  return (
    <div className="flex flex-col w-full gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <PageTitle title="Manage Category" />
      <Row className="justify-end">
        <Button onClick={addData}>
          <FontAwesomeIcon icon={faCirclePlus} /> Add New Category
        </Button>
      </Row>
      <Cards>
        <Tables columns={columns} data={dataTable} />
      </Cards>
      <ConfirmationModal
        isOpen={isModalOpenConfirmation}
        onClose={closeModalConfirmation}
        onSubmit={onSubmit}
        message={condition}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        header={`${modalHeader} Category`}
        maxWidth="max-w-xl"
        closeButton={false}
        closeOnOutsideClick={false}
      >
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full items-start gap-3"
        >
          <Row className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Category Name
            </p>

            <input
              className="w-full max-w-[500px] px-3 py-2 "
              type="text"
              placeholder="Type here"
              value={categoryName}
              required
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Row>
          <Row className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">Status</p>

            <select
              className="w-full max-w-[500px] px-3 py-2"
              value={categoryStatus}
              onChange={(e) => setCategoryStatus(e.target.value)}
            >
              <option value="Y">Active</option>
              <option value="N">Disabled</option>
            </select>
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

export default ManageCategory;