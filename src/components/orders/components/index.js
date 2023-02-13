import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Layout,
  Select,
  Table,
  notification,
  Tabs,
  Popconfirm,
  Modal,
} from 'antd';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import {
  fetchMerchantTransactions,
  updateTransactionStatus,
  fetchMerchants,
} from '../actions';
import './index.scss';
import { getUser } from '../../../utilities/token';
const { TabPane } = Tabs;

const { Option } = Select;

const orderStatusText = (status) => {
  return status === 0
    ? 'IDLE'
    : status === 1
    ? 'CONFIRMED'
    : status === 2
    ? 'FOR PICK UP'
    : status === 3
    ? 'FOR DROP OFF'
    : status === 4
    ? 'DROP OFF LOCATION'
    : status === 5
    ? 'DELIVERED'
    : status === 6
    ? 'CANCELLED'
    : 'REJECTED';
};

const Orders = (props) => {
  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customer',
      key: 'customerName',
      render: (customer) => customer && customer.name,
    },
    {
      title: 'Rider Name',
      dataIndex: 'rider',
      key: 'riderName',
      render: (rider) => (rider && rider.name ? rider.name : 'No Rider Yet'),
    },
    {
      title: 'Total Service Fee',
      dataIndex: 'serviceFee',
      key: 'serviceFee',
      render: (service) => {
        let numOr0 = (n) => (isNaN(n) ? 0 : n);
        let total =
          service && service.reduce((a, b) => numOr0(a) + numOr0(b.amount), 0);

        return service && service.length > 0 ? (
          <a onClick={() => info(service)}>{total}</a>
        ) : (
          <span>0</span>
        );
      },
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return orderStatusText(status);
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title='Update order status?'
          onConfirm={() => {
            (record && record.status === 0) || (record && record.status === 1)
              ? handleOrderComplete(record.id)
              : handleHandToRider(record.id);
          }}
        >
          <a style={{ color: '#fa3f63' }}>
            {record.status === 0 || record.status === 1
              ? 'Order Complete'
              : 'Hand to Rider'}
          </a>
        </Popconfirm>
      ),
    },
  ];

  function info(service) {
    Modal.info({
      title: 'Service Fee Breakdown',
      content: (
        <div style={{ marginTop: 20 }}>
          {service.map((s) => (
            <p>
              {_.startCase(s.type)}: <b>{s.amount}</b>
            </p>
          ))}
        </div>
      ),
      onOk() {},
    });
  }

  const expandedRowRender = ({ products }) => {
    console.log('expand data', products);
    const columns = [
      {
        title: 'Product Title',
        dataIndex: 'product',
        key: 'productTitle',
        render: (product) => product && product.title,
      },
      {
        title: 'Product Description',
        dataIndex: 'product',
        key: 'productDescription',
        render: (product) => product && product.description,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'Total Amount',
        key: 'totalAmount',
        render: (product) =>
          (product && product.quantity) * (product && product.price),
      },
    ];

    return <Table columns={columns} dataSource={products} pagination={false} />;
  };

  const [tableData, setTableData] = useState([]);
  const [merchantsData, setMerchantsData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  const handleOrderComplete = async (id) => {
    const data = {
      id,
      status: 2,
    };
    await props.onUpdateTransactionStatus(data);

    await props
      .onfetchMerchantTransactions(selectedMerchant ? selectedMerchant : userId)
      .then((res) => {
        setTableData(res);
      });
  };

  const handleHandToRider = async (id) => {
    const data = {
      id,
      status: 3,
    };
    await props.onUpdateTransactionStatus(data);

    await props
      .onfetchMerchantTransactions(selectedMerchant ? selectedMerchant : userId)
      .then((res) => {
        setTableData(res);
      });
  };

  const onSelectMerchant = (merchantId) => {
    setSelectedMerchant(merchantId);
    props.onfetchMerchantTransactions(merchantId).then((res) => {
      setTableData(res);
    });

    console.log('Selected Merchant ID', merchantId);
  };

  const beepSound = () => {
    var sound = new Audio(
      'data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU='
    );
    sound.play();
  };

  const openNotificationWithIcon = (data) => {
    const { product, customer } = data;
    console.log('notifIcon', data);
    notification['info']({
      duration: 0,
      message: `You got a new order from ${customer && customer.name}`,
      description: `Ordered ${product && product.title}`,
    });

    props
      .onfetchMerchantTransactions(selectedMerchant ? selectedMerchant : userId)
      .then((res) => {
        setTableData(res);
      });
  };

  useEffect(() => {
    // sound for notif

    window.Echo.channel(`merchant.${getUser().id}`).listen(
      '.merchant-create-transaction-channel',
      (response) => {
        const { data } = response;

        beepSound();
        openNotificationWithIcon(data);
        console.log('MERCHANT GOT AN EVENT!', data.status);
        // do shit in this data
        console.log('echo response', data);
      }
    );

    const type = getUser().type;
    const currentUserType =
      type === 4
        ? 'admin'
        : type === 3
        ? 'merchant'
        : type === 2
        ? 'riders'
        : 'customers';

    // if admin get merchants
    currentUserType === 'admin' &&
      props.onFetchMerchants().then((res) => {
        console.log('merchants data', res);
        setMerchantsData(res);
      });

    // set current user id
    setUserId(getUser().id);
    console.log('user', getUser());

    // fetch current user transactions if not admin
    currentUserType === 'merchant' &&
      props.onfetchMerchantTransactions(getUser().id).then((res) => {
        setTableData(res);
      });
  }, []);

  return (
    <Layout className='orders-container'>
      <Row justify='space-between' align='bottom' className='page-header'>
        <Col>
          {merchantsData && merchantsData.length !== 0 && (
            <Col>
              <Select
                placeholder='Select Merchant'
                style={{ width: 200 }}
                onChange={onSelectMerchant}
              >
                {merchantsData.map((merchant) => (
                  <Option
                    value={merchant.id}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {merchant.name}
                  </Option>
                ))}
              </Select>
            </Col>
          )}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Tabs defaultActiveKey='0' onChange={(data) => console.log(data)}>
            <TabPane tab='Incoming Orders' key='0'>
              <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={tableData.filter(
                  (data) => data.status === 0 || data.status === 1
                )}
                loading={props.loading}
                expandable={{ expandedRowRender }}
              />
            </TabPane>
            <TabPane tab='For Delivery' key='1'>
              <Table
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={tableData.filter((data) => data.status === 2)}
                loading={props.loading}
                expandable={{ expandedRowRender }}
              />
            </TabPane>
            <TabPane tab='List of Orders' key='2'>
              <Table
                rowKey={(record) => record.id}
                columns={columns.filter((col) => col.key !== 'action')}
                dataSource={tableData.filter(
                  (data) =>
                    data.status !== 2 && data.status !== 1 && data.status !== 0
                )}
                loading={props.loading}
                expandable={{ expandedRowRender }}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    products: state.orders.transactionsData,
    loading: state.orders.transactionsLoading,
    categories: state.categories.categoriesData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateTransactionStatus: (data) =>
      dispatch(updateTransactionStatus(data)),
    onFetchMerchants: (data) => dispatch(fetchMerchants(data)),
    onfetchMerchantTransactions: (data) =>
      dispatch(fetchMerchantTransactions(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
