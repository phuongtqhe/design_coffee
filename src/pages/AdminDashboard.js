import React, { useEffect, useState } from "react";
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";
import { Line, Pie, DualAxes, Column } from "@ant-design/plots";
import InputGroup from "react-bootstrap/InputGroup";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function Dashboard() {
  const Currentdate = new Date(); //current date
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  //for query statistic
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  //

  //for yealy report
  const [yearlySelected, setYearlySelected] = useState(
    Currentdate.getFullYear()
  );
  const [categorySpec, setCategorySpec] = useState("revenue");
  const [brandSpec, setBrandSpec] = useState("revenue");
  //

  //for selected month report
  const [isCategory, setIsCategory] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(Currentdate.getMonth());
  const [selectedYear, setSelectedYear] = useState(Currentdate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    new Date(
      Currentdate.getFullYear() + "-" + (Currentdate.getMonth() + 1) + "-01"
    )
  );
  //

  // Remove brands
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]); //fetched orders
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:9999/orders?statusId=3`)
      .then((res) => res.json())
      .then((json) => setOrders(json));

    fetch(`http://localhost:9999/orderItems`)
      .then((res) => res.json())
      .then((json) => setOrderItems(json));

    fetch(`http://localhost:9999/products`)
      .then((res) => res.json())
      .then((json) => setProducts(json));

    // Removed brands fetch

    fetch(`http://localhost:9999/categories`)
      .then((res) => res.json())
      .then((json) => setCategories(json));
    // Remove direct DOM manipulation for radio buttons
  }, []);

  const getStatisticNumber = (from, to) => {
    // Filter orders by date range
    let temp = [...orders].filter((o) => {
      if (!o.orderedDate) return false;
      const orderDateStr = o.orderedDate; // Format: "YYYY-MM-DD"
      const fromDateStr = from; // Format: "YYYY-MM-DD"
      const toDateStr = to; // Format: "YYYY-MM-DD"
      // Simple string comparison works for YYYY-MM-DD format
      return orderDateStr >= fromDateStr && orderDateStr <= toDateStr;
    });
    // Get all orderItems for these orders
    const items = orderItems.filter((oi) =>
      temp.some((o) => o.id === oi.orderId)
    );
    // Helper: get product by id
    const getProduct = (pid) => products.find((p) => p.id == pid) || {};
    let data = {
      from: from,
      to: to,
      revenue: 0,
      profit: 0,
      totalQuantity: items.reduce((a, b) => a + (b.quantity || 0), 0),
      order: temp.length,
      category: categories.map((c) => ({
        name: c.name,
        id: c.id,
        quantity: 0,
        profit: 0,
        revenue: 0,
      })),
    };
    items.forEach((oi) => {
      const prod = getProduct(oi.productId);
      const catIdx = categories.findIndex((c) => c.id == prod.categoryId);
      // Revenue: sum totalCost
      data.revenue += oi.totalCost || oi.unitPrice * oi.quantity;
      // Profit: (unitPrice - originPrice) * quantity
      const profit =
        ((oi.unitPrice || prod.price) - (prod.originPrice || 0)) *
        (oi.quantity || 0);
      data.profit += profit;
      // Category stats
      if (catIdx >= 0) {
        data.category[catIdx].quantity += oi.quantity || 0;
        data.category[catIdx].profit += profit;
        data.category[catIdx].revenue +=
          oi.totalCost || oi.unitPrice * oi.quantity;
      }
    });
    return data;
  };

  const currentMonthReport = () =>
    getStatisticNumber(
      dateArrayByYear(selectedYear)[selectedMonth][0],
      dateArrayByYear(selectedYear)[selectedMonth][1]
    );
  const pre_currentMonthReport = () =>
    getStatisticNumber(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0)
    );

  useEffect(() => {
    setSelectedDate(
      new Date(selectedYear + "-" + (Number(selectedMonth) + 1) + "-01")
    );
  }, [selectedMonth, selectedYear]);

  const [dataForYearly, setDataForYearly] = useState(
    dateArrayByYear(yearlySelected).map((a) => getStatisticNumber(a[0], a[1]))
  );

  //category yearly
  const getTotalYearlyCategory = (year) => {
    //get total of a year for pie chart
    let arr = dateArrayByYear(year);
    return getStatisticNumber(arr[0][0], arr[11][1]).category;
  };
  const getDataYearlyCategory = () => {
    let dataYearlyCategory = dataForYearly.map((d, idx) => {
      const monthLabel = dateArrayByYear(yearlySelected)[idx][2]; // Get month name
      return d.category.map((dc) => ({ ...dc, to: monthLabel }));
    });
    let ak = [];
    dataYearlyCategory.map((d) => [ak.push(...d)]);
    return ak;
  };
  //

  useEffect(() => {
    setDataForYearly(
      dateArrayByYear(yearlySelected).map((a) => getStatisticNumber(a[0], a[1]))
    );
  }, [yearlySelected, orders, categories]);
  // console.log(getDataYearlyCategory())
  //
  return (
    <div>
      <h3 className="mt-2">Dashboard</h3>
      <Row>
        <Col xs={6} md={3}>
          <h4>Report on {monthNames[selectedMonth] + " " + selectedYear}</h4>
        </Col>
        <Col xs={6} md={2}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Month</InputGroup.Text>
            <Form.Select
              type="date"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                console.log(selectedDate);
              }}
            >
              {monthNames.map((m, index) => (
                <option key={index} value={index}>
                  {m}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs={12} md={2}>
          <InputGroup className="mb-3">
            <InputGroup.Text>Year</InputGroup.Text>
            <Form.Control
              type="number"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
              }}
            ></Form.Control>
          </InputGroup>
        </Col>
        <Col xs={12} md={3}>
          <Button
            onClick={() => {
              setSelectedMonth(Currentdate.getMonth());
              setSelectedYear(Currentdate.getFullYear());
            }}
            variant="primary"
          >
            Back to present
          </Button>
          <Button
            onClick={
              selectedMonth > 0
                ? () => {
                    setSelectedMonth(selectedMonth - 1);
                  }
                : () => {
                    setSelectedMonth(11);
                    setSelectedYear(selectedYear - 1);
                  }
            }
            variant="danger"
          >
            Previous month
          </Button>
        </Col>
      </Row>
      <div className="d-flex justify-content-between align-items-center gap-3 mt-4">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total revenue</p>
            <h4 className="mb-0 sub-title">
              {currentMonthReport().revenue.toLocaleString("vi-VN")} ₫
            </h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6>
              {pre_currentMonthReport().revenue > 0 ? (
                (currentMonthReport().revenue /
                  pre_currentMonthReport().revenue) *
                  100 -
                  100 >=
                0 ? (
                  <div style={{ color: "green" }}>
                    <AiOutlineRise size={25} className="m-0" />{" "}
                    {"+" +
                      (
                        (currentMonthReport().revenue /
                          pre_currentMonthReport().revenue) *
                          100 -
                        100
                      ).toFixed(2) +
                      "%"}
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    <AiOutlineFall size={25} className="m-0" />{" "}
                    {(
                      (currentMonthReport().revenue /
                        pre_currentMonthReport().revenue) *
                        100 -
                      100
                    ).toFixed(2) + "%"}
                  </div>
                )
              ) : (
                <div style={{ color: "gray" }}></div>
              )}
            </h6>
            <p className="mb-0  desc">
              Compared to{" "}
              {monthNames[pre_currentMonthReport().from.getMonth()] +
                " " +
                pre_currentMonthReport().from.getFullYear()}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 roudned-3">
          <div>
            <p className="desc">Total orders</p>
            <h4 className="mb-0 sub-title">{currentMonthReport().order}</h4>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6>
              {pre_currentMonthReport().order > 0 ? (
                (currentMonthReport().order / pre_currentMonthReport().order) *
                  100 -
                  100 >=
                0 ? (
                  <div style={{ color: "green" }}>
                    <AiOutlineRise size={25} className="m-0" />{" "}
                    {"+" +
                      (
                        (currentMonthReport().order /
                          pre_currentMonthReport().order) *
                          100 -
                        100
                      ).toFixed(2) +
                      "%"}
                  </div>
                ) : (
                  <div style={{ color: "red" }}>
                    <AiOutlineFall size={25} className="m-0" />{" "}
                    {(
                      (currentMonthReport().order /
                        pre_currentMonthReport().order) *
                        100 -
                      100
                    ).toFixed(2) + "%"}
                  </div>
                )
              ) : (
                <div style={{ color: "gray" }}></div>
              )}
            </h6>
            <p className="mb-0  desc">
              Compared to{" "}
              {monthNames[pre_currentMonthReport().from.getMonth()] +
                " " +
                pre_currentMonthReport().from.getFullYear()}
            </p>
          </div>
        </div>
      </div>
      <div
        className="btn-group mt-2"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          checked
          type="radio"
          className="btn-check"
          name="btnradioxyz"
          id="btnradiocate1"
          autoComplete="off"
          readOnly
        ></input>
        <label className="btn btn-outline-primary" htmlFor="btnradiocate1">
          Category
        </label>
      </div>
      <div className="row">
        <div className="col-12 col-lg-6 col-xl-6">
          <DemoPie
            data={currentMonthReport().category}
            spec="revenue"
          ></DemoPie>
        </div>
        <div className="col-12 col-lg-6 col-xl-6">
          <DemoPie
            data={currentMonthReport().category}
            spec="quantity"
          ></DemoPie>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-5 title">Yearly statistic {yearlySelected}</h3>
        <Row>
          <Col xs={6} md={3}>
            <InputGroup className="mb-3">
              <InputGroup.Text>Year</InputGroup.Text>
              <Form.Control
                type="number"
                value={yearlySelected}
                onChange={(e) => {
                  setYearlySelected(e.target.value);
                }}
              ></Form.Control>
            </InputGroup>
          </Col>
          <Col xs={12} md={3}>
            <Button
              onClick={() => setYearlySelected(Currentdate.getFullYear())}
              variant="primary"
            >
              Jump to current year
            </Button>
          </Col>
        </Row>

        <div className="row m-5">
          <div className="col-12 col-lg-6">
            <h4>Revenue</h4>
            <RevenueChart data={dataForYearly} />
          </div>
          {/* Total Revenue for the year */}
          <div className="d-flex justify-content-center mb-4 col-12 col-lg-6">
            <div
              className="bg-white p-4 rounded shadow-sm"
              style={{ minWidth: "300px" }}
            >
              <p className="desc mb-1">Total Revenue {yearlySelected}</p>
              <h3 className="mb-0 sub-title text-primary">
                {dataForYearly
                  .reduce((sum, month) => sum + (month.revenue || 0), 0)
                  .toLocaleString("vi-VN")}{" "}
                ₫
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="row m-5">
          <h4>Category-based yearly report on {yearlySelected} </h4>
          <div
            className="btn-group mt-2"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              onClick={() => setCategorySpec("revenue")}
              value={"category"}
              checked={categorySpec === "revenue"}
              type="radio"
              className="btn-check"
              name="btnradiocate"
              id="btnradiozcate1"
              autoComplete="off"
            ></input>
            <label className="btn btn-outline-primary" htmlFor="btnradiozcate1">
              Revenue
            </label>

            <input
              onClick={() => setCategorySpec("quantity")}
              value={"category"}
              type="radio"
              className="btn-check"
              name="btnradiocate"
              id="btnradiozcate2"
              autoComplete="off"
            ></input>
            <label className="btn btn-outline-primary" htmlFor="btnradiozcate2">
              Products sold
            </label>
          </div>
          <div className="col-12 col-lg-6 col-xl-8">
            <DemoLine
              data={getDataYearlyCategory()}
              spec={categorySpec}
            ></DemoLine>
          </div>
          <div className="col-12 col-lg-6 col-xl-4">
            <DemoPie
              data={getTotalYearlyCategory(yearlySelected)}
              spec={categorySpec}
            ></DemoPie>
          </div>
        </div>
      </div>
      <div className="mt-5">
        {/* Removed brand-based yearly report section */}
      </div>
    </div>
  );
}

const DemoPie = (props) => {
  const { data, spec } = props;
  const config = {
    appendPadding: 10,
    data,
    theme: "light",
    angleField: spec,
    colorField: "name",
    radius: 0.8,
    innerRadius: 0.64,
    meta: {
      [spec]: {
        formatter: (v) =>
          spec !== "quantity" ? v?.toLocaleString("vi-VN") + " ₫" : v,
      },
    },
    label: {
      offset: "-50%",
      autoRotate: false,
      style: {
        textAlign: "center",
        fill: "#fff",
      },
      formatter: (datum) => {
        if (!datum || typeof datum.percent === "undefined") return "";
        return `${(datum.percent * 100).toFixed(0)}%`;
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: {
        formatter: (v) =>
          spec !== "quantity"
            ? spec.charAt(0).toUpperCase() + spec.slice(1)
            : "Products sold",
        offsetY: -8,
        style: {
          color: "#000",
        },
      },
      content: {
        style: {
          color: "#000",
          fontSize: "1rem",
        },
        offsetY: -4,
      },
    },
    pieStyle: {
      lineWidth: 0,
    },
  };
  return <Pie {...config} />;
};
const DemoLine = (props) => {
  const { data, spec } = props;
  // Get unique category names for color mapping
  const categoryNames = [...new Set(data.map((d) => d.name))].sort();
  const colors = [
    "#1890ff",
    "#52c41a",
    "#faad14",
    "#f5222d",
    "#722ed1",
    "#13c2c2",
    "#eb2f96",
    "#fa8c16",
  ];

  // Create color mapping object - map each category to a color
  const colorMap = {};
  categoryNames.forEach((name, idx) => {
    colorMap[name] = colors[idx % colors.length];
  });

  const config = {
    data,
    autoFit: false,
    xField: "to",
    yField: spec,
    seriesField: "name",
    // Use array of colors - ant-design/plots will map them to series in order
    color: categoryNames.map((name) => colorMap[name]),
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    legend: {
      position: "top",
    },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  };
  return <Line {...config} />;
};

const OrderDualAxes = (props) => {
  const { data } = props;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedData = data.map((d, idx) => ({
    ...d,
    month: monthNames[idx] || `Month ${idx + 1}`,
  }));

  const config = {
    data: [formattedData, formattedData],
    xField: "month",
    yField: ["order", "totalQuantity"],
    geometryOptions: [
      {
        geometry: "column",
      },
      {
        geometry: "line",
        point: {
          size: 5,
          shape: "diamond",
        },
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
  };
  return <DualAxes {...config} />;
};
const RevenueChart = (props) => {
  const { data } = props;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedData = data.map((d, idx) => ({
    ...d,
    month: monthNames[idx] || `Month ${idx + 1}`,
  }));

  const config = {
    data: formattedData,
    xField: "month",
    yField: "revenue",
    columnStyle: {
      fill: "#1890ff",
    },
    label: {
      position: "top",
      formatter: (datum) => {
        return datum.revenue
          ? datum.revenue.toLocaleString("vi-VN") + " ₫"
          : "";
      },
    },
  };
  return <Column {...config} />;
};

// This will output an array of 12 periods of time from January to December of the year 2023
const dateArrayByYear = (year) => {
  var arr = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  for (let i = 0; i < 12; i++) {
    var start = new Date(year, i, 1);
    var end = new Date(year, i + 1, 0);
    arr.push([
      start.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10),
      monthNames[i], // Add month name for display
    ]);
  }
  return arr;
};

//console.log(dateArrayByYear(2024))
