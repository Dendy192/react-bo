import React, { useRef, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import PageTitle from "../components/PageTitle";
import Row from "../components/Row";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import Loading from "../components/Loading";

const ManageUser = () => {
  const url = backendUrl + "/backend/api/users";
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalOpenConfirmation, setModalOpenConfirmation] = useState(false);
  const [condition, setCondition] = useState("");
  const [modalHeader, setModalHeader] = useState("Add New");

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const openModalConfirmation = () => setModalOpenConfirmation(true);
  const closeModalConfirmation = () => setModalOpenConfirmation(false);

  const toastId = useRef(null);
  const toastIdError = useRef(null);

  const breadcrumbItems = [{ label: "Users" }, { label: "Manage Users" }];

  const columns = [
    { Header: "No", accessor: "no" },
    { Header: "Name", accessor: "name" },
    { Header: "Status", accessor: "status" },
    { Header: "Action", accessor: "action" },
    { Header: "Action", accessor: "action" },
  ];
  if (loading) return <Loading />;
  return (
    <div className="flex flex-col w-full gap-4">
      <Breadcrumb items={breadcrumbItems} />
      <PageTitle title="Manage Users" />
      <Row className="justify-end">
        <Button onClick={addData}>
          <FontAwesomeIcon icon={faCirclePlus} /> Add New Users
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
        header={`${modalHeader} User`}
        maxWidth="max-w-xl"
        closeButton={false}
        closeOnOutsideClick={false}
      >
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full items-start gap-3"
        >
          <Row className="w-full">
            <p className="text-sm font-medium text-gray-700 mb-2">User Name</p>

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

export default ManageUser;
