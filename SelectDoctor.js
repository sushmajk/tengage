import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Image,
  FormGroup,
  FormControl,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";

import Container from "react-bootstrap/Container";
import "./SelectDoctor.scss";
import calender from "../../_assets/images/Calendar-24px.svg";
import triangle from "../../_assets/images/Group 2.svg";
import Figure from "react-bootstrap/Figure";
import SubHeader from "../../shared/SubHeader";
// import PhysicalVisit from "../../_assets/images/Physical visit.png";
import Doctor1 from "../../_assets/images/doctor_icon.svg";
import Search from "../../_assets/images/search.svg";
import expand from "../../_assets/images/Expand.svg";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { apiurlConstants } from "../../_constants/apiurl.constants";
import { userService } from "../../_services";
import { CalendarComponent } from "@syncfusion/ej2-react-calendars";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { PrivateRoute } from "../../_helpers";
import jwt_decode from "jwt-decode";
import { useLocation } from "react-router-dom";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ComingSoonTooltip from "../../shared/ComingSoon/ComingSoon";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../_actions/user.actions";
import Drawer from "@mui/material/Drawer";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
// import filter_list from "../../_assets/images/filter_list.svg";
// import rating from "../../_assets/images/rating.svg";
// import search from "../../_assets/images/search.svg";
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import { Tab, Tabs } from "@material-ui/core";
// import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
// import RangeSlider from "react-bootstrap-range-slider";
// import TabPanel from '@mui/lab/TabPanel';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
// import FormControl from '@mui/material/FormControl';
import FormLabel from "@mui/material/FormLabel";
import { identifier } from "@babel/types";
// import SearchData from '../../shared/Search/SearchData';

const SelectDoctor = function (props) {
  let history = useHistory();
  const dispatch = useDispatch();

  const location = useLocation();

  const [doctorList, setDoctorList] = useState([]);
  const [specialityList, setSpecialityList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [called, setCalled] = useState(false);
  const [show, showCalender] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [dateState, setDateState] = useState(new Date());
  const [radioData, setRadioData] = useState({
    radioSelection: "",
    another: "another",
  });
  const [genderDoc, setGenderDoc] = useState("");
  const [experienceDoc, setExperienceDoc] = useState("");
  const { radioSelection } = radioData;
  // const changeDate = (e) => {
  //   setDateState(e);
  // };

  // const datePicker = (date) => {
  //   <DatePicker
  //     selected={selectedDate}
  //     onChange={(date) => setSelectedDate(date)}
  //   />;
  //   console.log("date", selectedDate);
  //   setCalled(true);
  // };
  const [dateType, setDateType] = useState("text");

  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);
  const [spinner, setSpinner] = useState(true);
  const [spinner_, setSpinner_] = useState(true);
  const [selectedSpeciality, setSelectedSpeciality] =
    useState("All Specialties");

  const [filterList, setFilterList] = useState(doctorList && doctorList);
  const [state, setState] = useState({
    doctors: doctorList,
    filters: new Set(),
});
let dispatch2 = useDispatch();
const doctorsStore = useSelector(state => state.doctors);

  const [value, setValue] = useState(0);
  // const [SpecialityList, setSpecialityList] = useState();

  let token = localStorage.getItem("user_patient");
  let decoded = jwt_decode(token);
  const careId = localStorage.getItem("careId");
  const getDoctors = () => {
    //docList by care
    setSpinner_(true);
    console.log("hi++++++++++");
    userService
      .methodGet(
        apiurlConstants.DoctorServiceUrl +
          "/doctor-service/doctors/?care-service-id=" +
          careId
      )
      .then(async (res) => {
        console.log("methodGetres++", res.data);
        setDoctorList(res.data);
        setFilterList(res.data);
      })
      .catch((err) => {
        console.log("methodGet++ Error", err);
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          err.toString();
        console.log("Error", message);
      })
      .finally(() => {
        setSpinner_(false);
        localStorage.removeItem("docId"); //localStorage.removeItem("speciality_id")
      });
  };

  const onGenderSelectHandler = (e) => {
    setGenderDoc(e.target.id);
    filterFunc("gender", e.target.id);
  };

  const onExperienceSelectHandler = (e) => {
    setExperienceDoc(e.target.id);
    filterFunc("experienceYears", e.target.id);
  };

  useEffect(() => {
    //localStorage.setItem("stepper", 1);
    localStorage.setItem("book", 1);
    localStorage.removeItem("speciality_value");
    localStorage.removeItem("speciality_id");
    localStorage.removeItem("dropdown");
    //specialities list
    console.log("props.careIndex++", props.careIndex);
    console.log("location.careIndex++", location.careIndex);
    userService
      .methodGet(
        apiurlConstants.HospitalServiceUrl +
          "/hospital-service/hospitals/" +
          decoded.hospital_id +
          "/hospital-specialities"
      )
      .then(async (res) => {
        console.log("methodGetres++", res.data);
        if (res.data.length > 1) {
          var spl = res.data.reverse();
          spl.push({ id: "0", title: "All Specialties" });
          setSpecialityList(spl.reverse());
          // console.log("spl++++", spl.reverse());
        } else {
          setSpecialityList(res.data);
        }
      })
      .catch((err) => {
        console.log("methodGet++ Error", err);
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          err.toString();
        console.log("Error", message);
      })
      .finally(() => {
        setSpinner(false);
        localStorage.removeItem("docId");
        //localStorage.removeItem("speciality_id")
      });
    getDoctors();
    //docList by care and specialities id
    //commit

    //filtering starts here
    userService

      .methodGet(
        apiurlConstants.HospitalServiceUrl +
          "/hospital-service/hospitals/" +
          decoded.hospital_id +
          "/hospital-specialities"
      )
      .then(async (res) => {
        console.log("methodGetres++", res.data);
        if (res.data.length > 1) {
          var spl = res.data.reverse();
          spl.push({ id: "0", title: "All Specialties" });
          setSpecialityList(spl.reverse()); // console.log("spl++++", spl.reverse());
        } else {
          setSpecialityList(res.data);
        }
        console.log(res.data, "specialityList");
      })
      .catch((err) => {
        console.log("methodGet++ Error", err);
        const message =
          (err.response && err.response.data && err.response.data.message) ||
          err.message ||
          err.toString();
        console.log("Error", message);
      })
      .finally(() => {
        setSpinner(false);
        localStorage.removeItem("docId"); //localStorage.removeItem("speciality_id")
      });
  }, []);

  const filterFunc = (selectedParam, param) => {
    let arr = [];
    if (selectedParam == "speciality") {
      doctorList &&
        doctorList.map((item, index) => {
          if (item.doctorSpecialities.length > 1) {
            item.doctorSpecialities.map((items) => {
              if (items.hospitalSpeciality.title == param) {
                arr.push(item);
              }
            });
          } else {
            if (item.doctorSpecialities[0].hospitalSpeciality["title"] == param)
              arr.push(item);
          }
        });
    } else if (selectedParam == "gender") {
      doctorList &&
        doctorList.map((item, index) => {
              if (item.gender == param) {
                arr.push(item);
              }
        });
    } else if (selectedParam == "experienceYears"){
      doctorList &&
      doctorList.map((item, index) => {
        //console.log("DOCTOR LIST", doctorList)
        if (param == 16) {
          if (item.experienceYears >= 16) {
            arr.push(item);
          }
        } else if (param == 15) {
          if (item.experienceYears >= 11 && item.experienceYears <= 15) {
            arr.push(item);
          }
        } else if (param == 10) {
          if (item.experienceYears >= 6 && item.experienceYears <= 10) {
            arr.push(item);
          }
        } else if (param == 5) {
          if (item.experienceYears >= 0 && item.experienceYears <= 5) {
            arr.push(item);
          }
        }
      });
    }
    setFilterList(arr);
  };
  //ends here

  // const GetDoctorsBySpeciality = (speciality_id) => {
  //   setSpinner_(true);
  //   console.log("speid", speciality_id);
  //   userService
  //     .methodGet(
  //       apiurlConstants.DoctorServiceUrl +
  //         "/doctor-service/doctors/?care-service-id=" +
  //         careId +
  //         "&hospital-speciality-id=" +
  //         speciality_id
  //     )
  //     .then(async (res) => {
  //       // console.log("no+++++++++111");
  //       setDoctorList(res.data);
  //       console.log("FirstName++++", doctorList);
  //       //console.log("experience++++", doctorList[0].experienceYears);
  //     })
  //     .catch((err) => {
  //       if (
  //         err?.response?.status == 400 &&
  //         (message.toLowerCase().includes("JWT") ||
  //           message.toLowerCase().includes("expired"))
  //       ) {
  //         localStorage.removeItem("user_patient");
  //         dispatch(logout());
  //         history.push("/signin");
  //       }
  //       console.log("no+++++++++222");
  //       console.log("methodGet++ Error", err);
  //       const message =
  //         (err.response && err.response.data && err.response.data.message) ||
  //         err.message ||
  //         err.toString();
  //       console.log("Error", message);
  //     })
  //     .finally(() => {
  //       setSpinner_(false);
  //       localStorage.removeItem("docId");
  //       // localStorage.removeItem("speciality_id")
  //     });
  // };

  const changeDate = (e) => {
    setDateState(e);
    console.log("changeDate+++", e);
    setSelectedDate(e);
    showCalender(!show);
  };
  // const handleChange = () => {
  //   setDatePickerIsOpen(!datePickerIsOpen);
  // };

  // const openDatePicker = () => {
  //   setDatePickerIsOpen(!datePickerIsOpen);
  // };
  const handleDoc = (index) => {
    //localStorage.removeItem("speciality_id")
    if (localStorage.getItem("user_patient") == null) {
      history.push("/signin");
      window.location.reload(false);
    } else {
      //alert(pathname);
      console.log("doc-index", index);
      //console.log("pathname", pathname);
      //alert();

      localStorage.setItem("docId", [index]);
      console.log("final call", doctorList[index].firstName);
      history.push({
        pathname: "/slots",
        selectedDate: selectedDate,
      });
    }
  };
  var toggleSpc = "Tele-Psychiatry";
  const handleSpeciality = (index) => {
    toggleSpc = specialityList[index].title;
    setSelectedSpeciality(toggleSpc);
    console.log("toggleSpeciality++", toggleSpc);
    localStorage.setItem("dropdown", toggleSpc);
    if (specialityList[index].title == "All Specialties") {
      getDoctors();
      localStorage.removeItem("speciality_id");
      localStorage.removeItem("speciality_value");
    } else {
      console.log("toggleSpeciality++", localStorage.getItem("dropdown"));
      localStorage.setItem("speciality_id", specialityList[index].id);
      localStorage.setItem("speciality_value", specialityList[index].title);
      console.log("speciality_value", specialityList[index].title);
      // GetDoctorsBySpeciality(specialityList[index].id);
    }
    // window.location.reload();
  };

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const handleRadioChange = (e) => {
    alert(e.target.value);
    // e.preventDefault();
    // e.persist();
    setRadioData((prevState) => ({
      ...prevState,
      radioSelection: e.target.vaue,
    }));
  };

  return (
    <div className="doctorDashboard-block">
      <SubHeader indexValue={"Select Doctor"} />
      <Container className="main-block-doctor">
        <div className="sideNav">
          {/* <Drawer> */}
          <div className="searchDiv">
            <div className="fieldDiv">{/* <SearchData /> */}</div>
            <div className="imageDiv">
              {/* <img src={filter_list} className="space" /> */}
            </div>
          </div>
          <div>
            {/* import { Tab, Tabs } from "@material-ui/core"; */}
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <Tab label="Filter" />
              <Tab label="Sort" />
            </Tabs>
            {tabIndex == 0 && (
              <div>
                <p className="lableText">Speciality</p>
                <div className="detailsStyleData1">
                  <p className="textAlignLanguage">
                    {specialityList?.length > 0 && specialityList != null ? (
                      specialityList.map((list, index) => (
                        <span
                          onClick={() => filterFunc("speciality", list.title)}
                          className="LangSpecialtiesBox"
                        >
                          {list.title}
                        </span>
                      ))
                    ) : (
                      <p></p>
                    )}
                  </p>
                </div>

                <p className="lableText">By Gender</p>
                <div className="detailsStyleData1">
                  <p className="textAlignLanguage">
                    <span
                      className="LangSpecialtiesBox"
                      id="MALE"
                      onClick={(e) => onGenderSelectHandler(e)}
                    >
                      Male
                    </span>
                    <span
                      className="LangSpecialtiesBox"
                      id="FEMALE"
                      onClick={(e) => onGenderSelectHandler(e)}
                    >
                      Female
                    </span>
                    <span
                      className="LangSpecialtiesBox"
                      id="OTHERS"
                      onClick={(e) => onGenderSelectHandler(e)}
                    >
                      Others
                    </span>
                  </p>
                </div>

                <p className="lableText">By Experience</p>
                <div className="detailsStyleData1">
                  <p className="textAlignLanguage">
                    <span
                      className="LangSpecialtiesBox"
                      id="5"
                      onClick={(e) => onExperienceSelectHandler(e)}
                    >
                      0-5 years
                    </span>
                    <span
                      className="LangSpecialtiesBox"
                      id="10"
                      onClick={(e) => onExperienceSelectHandler(e)}
                    >
                      6-10 years
                    </span>
                    <span
                      className="LangSpecialtiesBox"
                      id="15"
                      onClick={(e) => onExperienceSelectHandler(e)}
                    >
                      11-15 years
                    </span>
                    <span
                      className="LangSpecialtiesBox"
                      id="16"
                      onClick={(e) => onExperienceSelectHandler(e)}
                    >
                      15 years & above
                    </span>
                  </p>
                </div>

                <p className="lableText">By Language</p>
                <div className="detailsStyleData">
                  {/* <p className="TextAlignLeftValue">
                    {doctorDetails?.languages?.length > 0 &&
                    doctorDetails?.languages != null ? (
                      doctorDetails?.languages.map((list) => (
                        <span className="SpecialtiesBox">{list.name}</span>
                      ))
                    ) : (
                      <p></p>
                    )}
                  </p> */}
                </div>

                {/* <p className="lableText">Consultation Fee</p>
                <div className="detailsStyleData">
                  <p className="TextAlignLeftValue">
                    <RangeSlider
                      value={value}
                      max={500}
                      min={200}
                      step={100}
                      onChange={(changeEvent) =>
                        setValue(changeEvent.target.value)
                      }
                    />
                  </p>
                </div>

                <p className="lableText">Ratings</p>
                <div className="detailsStyleData">
                <p className="TextAlignLeftValue">
                  <FormGroup>
                    <Form.Check type="checkbox" ><span>4<img src={rating} className="space" />& above</span></Form.Check>
                    <Form.Check type="checkbox" label="3 & above" />
                    <Form.Check type="checkbox" label="2 & above" />
                  </FormGroup>
                  </p>
                  </div> */}
              </div>
            )}
            {tabIndex == 1 && (
              <div>
                <Form.Group controlId="radioSelection">
                  <Form.Check
                    type="radio"
                    // aria-label="radio 1"
                    label="Date"
                    // value={radioData}
                    onChange={handleRadioChange}
                    checked={radioData === "Date"}
                  />
                  <Form.Check
                    type="radio"
                    value="Recently added"
                    // aria-label="radio 1"
                    label="Recently added"
                    // value={radioData}
                    onChange={handleRadioChange}
                    checked={radioData === "Recently added"}
                  />
                  <Form.Check
                    type="radio"
                    value="Ascending Order"
                    label="Ascending Order"
                    // value={radioData}
                    // aria-label="radio 1"
                    onChange={handleRadioChange}
                    checked={radioData === "Ascending Order"}
                  />
                  <Form.Check
                    type="radio"
                    value="Descending Order"
                    label="Descending Order"
                    // value={radioData}
                    // aria-label="radio 1"
                    onChange={handleRadioChange}
                    checked={radioData === "Descending Order"}
                  />
                </Form.Group>
              </div>
            )}
            {/* <TabPanel value="" index={0}>
                  Item One
              </TabPanel>
        <TabPanel value="" index={1}>
          Item Two
        </TabPanel> */}
          </div>

          {/* </Drawer> */}
        </div>
        <div className="doctorListDiv">
          <Row>
            <Col>
              <h6 className="titleLeft">Select a Doctor</h6>
            </Col>
            <Col>
              <Dropdown
                className="title-right"
                style={{ border: "1px solid #E6E9EC", color: "#707070" }}
              >
                <Dropdown.Menu
                  className={
                    specialityList.length <= 7 ? "menuListDiv" : "menuList"
                  }
                >
                  {specialityList.map((item, index) => (
                    <div key={index}>
                      <Dropdown.Item
                        className="SpecialityItems"
                        onClick={() => {
                          handleSpeciality(index);
                        }}
                      >
                        {/* <text></text> */}

                        <div className="SpecialityItemsText">{item.title}</div>
                      </Dropdown.Item>
                    </div>
                  ))}
                </Dropdown.Menu>
                <Dropdown.Toggle
                  variant="white"
                  id="dropdown-basic"
                  className="selectedSpecialtyName"
                >
                  {selectedSpeciality}
                </Dropdown.Toggle>
              </Dropdown>
            </Col>
          </Row>
          {/* <button onClick={openDatePicker}>openDate</button>
        <DatePicker
          //selected={this.state.startDate}
          onChange={handleChange}
          onClickOutside={openDatePicker}
          open={datePickerIsOpen}
          
        /> */}

          <Row>
            <Col>
              <Card className="doctor-card">
                <Card.Header className="HomeHeader">
                  <Row className="SelectDocRow">
                    <Col xs={{ span: 1 }} md={{ span: 1 }}>
                      <Image
                        src={calender}
                        onClick={() => {
                          showCalender(!show);
                        }}
                      ></Image>
                    </Col>
                    <Col md="4" xs={{ span: 6 }}>
                      <p className="titleList">
                        {dateState.getDate() == new Date().getDate()
                          ? "TODAY, "
                          : ""}
                        {moment(dateState).format("DD-MMM-YYYY")}
                      </p>
                    </Col>
                    <Col
                      className="icon-search"
                      md={{ offset: 4 }}
                      xs={{ offset: 0 }}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={ComingSoonTooltip}
                      >
                        <Image
                          src={Search}
                          //className="search-icon"
                          diabled
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Disabled"
                        ></Image>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={ComingSoonTooltip}
                      >
                        <Button
                          className="filterby"
                          diabled
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Disabled"
                        >
                          Filter by
                        </Button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                </Card.Header>
                {show && (
                  <>
                    <Image
                      src={triangle}
                      style={{
                        margin: "-2% 0px -2.4% 6%",
                        height: "1%",
                        width: "8%",
                        zIndex: "2",
                      }}
                    />
                    <Calendar
                      // minDetail='month'
                      // prev2Label="null"
                      defaultView="month"
                      // calendarStartDay={3}
                      calendarType="US"
                      formatMonthYear={(locale, date) =>
                        date.toLocaleString(locale, {
                          month: "short",
                          year: "numeric",
                        })
                      }
                      prev2AriaLabel={null}
                      prevAriaLabel="Go to prev month"
                      value={dateState}
                      minDate={new Date()}
                      onChange={changeDate}
                      selected={selectedDate}
                    />
                  </>
                )}
                {spinner_ ? (
                  <div className="SpinnerView">
                    <div className="SpinnerElement">
                      <Spinner animation="border" variant="primary"></Spinner>
                    </div>
                    <h4 className="SpinnerLoadingText">Loading...</h4>
                  </div>
                ) : filterList && filterList.length > 0 ? (
                  <Card.Body className="scroll-body">
                    {filterList.map((item, index) => (
                      <div className="scroll-div">
                        <Row>
                          <Col xs={4} md={2}>
                            <Figure.Image
                              className="doctor1"
                              id="dashboard-fig-addHospital"
                              alt="Patient"
                              src={Doctor1}
                            />
                          </Col>

                          <Col xs={8} md={6} className="">
                            <h3 className="doctorName">
                              {" Dr. " + item.firstName}{" "}
                              {" " + item.lastName != undefined &&
                              item.lastName != null
                                ? item.lastName
                                : ""}
                            </h3>

                            <p className="yearsOE">
                              {item.experienceYears}+ Years of experience
                            </p>
                          </Col>
                        </Row>
                        <div>
                          <Row>
                            <Col xs={6} md={3} className="row1">
                              <p className="text">Language</p>
                              <Row className="lang-row">
                                <p className="options">
                                  {item?.languages != undefined
                                    ? item?.languages[0]?.name
                                    : "-"}
                                </p>
                                {item.languages?.length > 1 ? (
                                  item.languages
                                    .slice(1)
                                    .map((list) => (
                                      <p className="options">,{list?.name}</p>
                                    ))
                                ) : (
                                  <p></p>
                                )}
                              </Row>
                            </Col>
                            <Col>
                              <p className="text">Type of Doctor</p>
                              <p className="options">-</p>
                            </Col>
                          </Row>
                        </div>
                        <Row>
                          <Col className="text-p">
                            <p> Specialty</p>
                            <div className="specialtie-doc">
                              {item.doctorSpecialities?.length > 0 ? (
                                item.doctorSpecialities.map((list) => (
                                  <p className="specialities">
                                    {list.hospitalSpeciality?.title}
                                  </p>
                                ))
                              ) : (
                                <p></p>
                              )}
                            </div>
                          </Col>
                        </Row>

                        {/* <Row className="row3"> */}
                        <Row>
                          <Col style={{ paddingTop: 9 }}>
                            <Image
                              className="expand"
                              src={expand}
                              diabled
                              // data-bs-toggle="tooltip"
                              // data-bs-placement="top"
                              // title="Disabled"
                            ></Image>

                            {/* <Link to="/slots" className="details"></Link> */}
                            <OverlayTrigger
                              placement="top"
                              overlay={ComingSoonTooltip}
                            >
                              <Link
                                className="details"
                                // onClick={() => {
                                //   handleDoc(index);
                                // }}
                              >
                                <u>Details</u>
                              </Link>
                            </OverlayTrigger>
                          </Col>

                          <Col>
                            <Button
                              className="bookApp"
                              onClick={() => {
                                handleDoc(index);
                              }}
                            >
                              Book Appointment
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Card.Body>
                ) : (
                  <p className="NoList">No doctors available</p>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default SelectDoctor;
