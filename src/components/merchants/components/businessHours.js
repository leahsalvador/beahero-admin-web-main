/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from 'react';
import { Form, Button, Space, Row, Col, Select, TimePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const BusinessHours = ({ form }) => {
  const [selectedDays, setSelectedDays] = useState(days);

  const handleSelect = () => {
    const { businessHours } = form.getFieldsValue();
    const selectedDays = businessHours.map((data) => data && data.day);

    setSelectedDays(() => days.filter((day) => !selectedDays.includes(day)));
  };

  const handleRemove = (toRemove, antdRemove) => {
    antdRemove(toRemove);
    const { businessHours } = form.getFieldsValue();
    const selectedDays = businessHours.map((data) => data && data.day);

    setSelectedDays(() => days.filter((day) => !selectedDays.includes(day)));
  };

  return (
    <Row>
      <Col span={24} style={{ marginTop: 15 }}>
        <Form.List name='businessHours'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space
                  key={field.key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align='baseline'
                >
                  <Form.Item
                    {...field}
                    name={[field.name, 'day']}
                    fieldKey={[field.fieldKey, 'day']}
                    rules={[{ required: true, message: 'Missing day' }]}
                  >
                    <Select
                      style={{ width: 130 }}
                      placeholder='Day'
                      onChange={handleSelect}
                    >
                      {selectedDays.map((day) => (
                        <Option key={day} value={day}>
                          {day}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...field}
                    name={[field.name, 'open']}
                    fieldKey={[field.fieldKey, 'open']}
                    rules={[{ required: true, message: 'Missing open time' }]}
                  >
                    <TimePicker
                      placeholder='Open time'
                      format='hh:mm A'
                      showTime={{ format: 'hh:mm A', use12Hours: true }}
                    />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'close']}
                    fieldKey={[field.fieldKey, 'close']}
                    rules={[{ required: true, message: 'Missing close time' }]}
                  >
                    <TimePicker
                      placeholder='Close time'
                      format='hh:mm A'
                      showTime={{ format: 'hh:mm A', use12Hours: true }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => handleRemove(field.name, remove)}
                  />
                </Space>
              ))}
              {days.length > fields.length && (
                <Button
                  type='dashed'
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add business hours
                </Button>
              )}
            </>
          )}
        </Form.List>
      </Col>
    </Row>
  );
};

export default BusinessHours;
