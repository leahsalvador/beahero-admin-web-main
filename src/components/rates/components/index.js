import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Layout,
  Button,
  Form,
  InputNumber,
  Empty,
  Switch,
} from 'antd';
import { connect } from 'react-redux';
import { fetchRates, postRates } from '../actions';
import './index.scss';

const defaultRates = {
  rates: [
    {
      type: 'basefare',
      amount: 0,
      status: 1,
    },
    {
      type: 'pesoPerKm',
      amount: 0,
      status: 1,
    },
    {
      type: 'queuingFee',
      amount: 0,
      status: 1,
    },
    {
      type: 'cashHandlingFee',
      amount: 0,
      status: 1,
    },
    {
      type: 'highValueFee',
      amount: 0,
      status: 1,
    },
    {
      type: 'detour',
      amount: 0,
      status: 1,
    },
    {
      type: 'surgePrice',
      amount: 0,
      status: 1,
    },
  ],
};

const Rates = (props) => {
  const { loading, ratesProp } = props;
  const [ratesData, setRatesData] = useState([]);
  const [form] = Form.useForm();

  const editRateStatus = (type, status) => {
    setRatesData((prev) => {
      return prev.map((item) => {
        var temp = Object.assign({}, item);
        if (temp.type === type) {
          temp.status = status ? 1 : 0;
        }
        return temp;
      });
    });
  };

  const isChecked = (type) => {
    return ratesData.some((rate) => rate.type === type && rate.status === 1);
  };

  const objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length &&
    Object.keys(o1).every((p) => o1[p] === o2[p]);

  const arraysEqual = (a1, a2) =>
    a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

  const handleCreateNow = () => {
    props.onPostRates(defaultRates);
    setRatesData(defaultRates.rates);

    const formatedRates = defaultRates.rates.map((r) => ({
      [r.type]: r.amount,
    }));

    // combine all the object in the array to set the fieldsValue
    const result = Object.values(
      formatedRates.reduce((result, { id, ...rest }) => {
        result[id] = {
          ...(result[id] || {}),
          ...rest,
        };
        return result;
      }, {})
    );

    form.setFieldsValue(result[0]);
  };

  const onFinish = async () => {
    await props.onPostRates({ rates: ratesData });
    await props.onFetchRates().then((res) => {
      setRatesData(res);
    });
  };

  useEffect(() => {
    props.onFetchRates().then((res) => {
      setRatesData(res);
      const formatedRates = res.map((r) => ({ [r.type]: r.amount }));

      // combine all the object in the array to set the fieldsValue
      const result = Object.values(
        formatedRates.reduce((result, { id, ...rest }) => {
          result[id] = {
            ...(result[id] || {}),
            ...rest,
          };
          return result;
        }, {})
      );

      console.log('res', res);

      form.setFieldsValue(result[0]);
    });
  }, []);

  const updateRates = () => {
    const formData = form.getFieldsValue();
    let newRatesArray = [...ratesData];
    // eslint-disable-next-line
    Object.keys(formData).map((type) => {
      let foundIndex = newRatesArray.findIndex((x) => x.type === type);
      let editData = { ...newRatesArray[foundIndex], amount: formData[type] };
      newRatesArray[foundIndex] = editData;
    });
    setRatesData(newRatesArray);
  };

  console.log('ratesData', ratesData);

  return (
    <Layout className='rates-container'>
      {ratesData.length > 0 ? (
        <Form
          layout='inline'
          form={form}
          id='myForm'
          onFinish={onFinish}
          onFieldsChange={() => updateRates()}
        >
          <Row gutter={[16, 16]}>
            <Col sm={24} lg={12}>
              <Row>
                <Col span={16} align='right'>
                  <Form.Item
                    rules={[{ required: true }]}
                    name='basefare'
                    label='Base Fare'
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Switch
                    checked={isChecked('basefare')}
                    checkedChildren='Active'
                    unCheckedChildren='Inactive'
                    onChange={(e) => editRateStatus('basefare', e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={12}>
              <Row>
                <Col span={16} align='right'>
                  <Form.Item
                    rules={[{ required: true }]}
                    name='pesoPerKm'
                    label='Peso Per Km'
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Switch
                    checked={isChecked('pesoPerKm')}
                    checkedChildren='Active'
                    unCheckedChildren='Inactive'
                    onChange={(e) => editRateStatus('pesoPerKm', e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={12}>
              <Row>
                <Col span={16} align='right'>
                  <Form.Item
                    rules={[{ required: true }]}
                    name='queuingFee'
                    label='Queuing Fee'
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Switch
                    checked={isChecked('queuingFee')}
                    checkedChildren='Active'
                    unCheckedChildren='Inactive'
                    onChange={(e) => editRateStatus('queuingFee', e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={12}>
              <Row>
                <Col span={16} align='right'>
                  <Form.Item
                    rules={[{ required: true }]}
                    name='cashHandlingFee'
                    label='Cash Handling Fee'
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Switch
                    checked={isChecked('cashHandlingFee')}
                    checkedChildren='Active'
                    unCheckedChildren='Inactive'
                    onChange={(e) => editRateStatus('cashHandlingFee', e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={12}>
              <Row>
                <Col span={16} align='right'>
                  <Form.Item
                    rules={[{ required: true }]}
                    name='highValueFee'
                    label='High Value Fee'
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Switch
                    checked={isChecked('highValueFee')}
                    checkedChildren='Active'
                    unCheckedChildren='Inactive'
                    onChange={(e) => editRateStatus('highValueFee', e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={12}>
              <Row>
                <Col span={16} align='right'>
                  <Form.Item
                    rules={[{ required: true }]}
                    name='detour'
                    label='Detour'
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Switch
                    checked={isChecked('detour')}
                    checkedChildren='Active'
                    unCheckedChildren='Inactive'
                    onChange={(e) => editRateStatus('detour', e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={24} lg={12}>
              <Row>
                <Col span={16} align='right'>
                  <Form.Item
                    rules={[{ required: true }]}
                    name='surgePrice'
                    label='Surge Price'
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Switch
                    checked={isChecked('surgePrice')}
                    checkedChildren='Active'
                    unCheckedChildren='Inactive'
                    onChange={(e) => editRateStatus('surgePrice', e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24} align='right'>
              <Button
                form='myForm'
                key='submit'
                htmlType='submit'
                disabled={arraysEqual(ratesData, ratesProp)}
                loading={loading}
              >
                Save Changes
              </Button>
            </Col>
          </Row>
        </Form>
      ) : (
        !loading && (
          <Empty
            image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
            imageStyle={{
              height: 60,
            }}
            description={<span>Rates are empty.</span>}
          >
            <Button type='primary' onClick={() => handleCreateNow()}>
              Create Now
            </Button>
          </Empty>
        )
      )}
    </Layout>
  );
};

function mapStateToProps(state) {
  return {
    loading: state.rates.ratesLoading,
    ratesProp: state.rates.ratesData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onFetchRates: (data) => dispatch(fetchRates(data)),
    onPostRates: (data) => dispatch(postRates(data)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rates);
