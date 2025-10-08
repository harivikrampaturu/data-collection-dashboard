import React, { useState, useEffect } from 'react';
import { Form, Select, Row, Col, Typography, Divider } from 'antd';
import useLocationData from '../hooks/useLocationData';

const { Title } = Typography;
const { Option } = Select;

const LocationSelector = ({ form, initialValues = {} }) => {
  const {
    countries,
    states,
    cities,
    indianStates,
    indianCities,
    indianPincodes,
    selectedCountry,
    selectedState,
    handleCountryChange,
    handleStateChange,
    setSelectedCountry,
    setSelectedState
  } = useLocationData();

  const [locationMode, setLocationMode] = useState('india'); // 'india' or 'global'

  useEffect(() => {
    // Set initial values if editing
    if (initialValues.country) {
      setSelectedCountry(initialValues.country);
    }
    if (initialValues.state) {
      setSelectedState(initialValues.state);
    }
  }, [initialValues, setSelectedCountry, setSelectedState]);

  const handleModeChange = (mode) => {
    setLocationMode(mode);
    // Reset form values when switching modes
    form.setFieldsValue({
      country: undefined,
      state: undefined,
      city: undefined,
      states: undefined,
      cities: undefined,
      pincodes: undefined
    });
    setSelectedCountry(null);
    setSelectedState(null);
  };

  return (
    <div>
      <Title level={5}>Location Filters (Optional)</Title>
      
      {/* Location Mode Selector */}
      <Form.Item
        name="locationMode"
        label="Location Scope"
        initialValue="india"
      >
        <Select onChange={handleModeChange}>
          <Option value="india">India Only</Option>
          <Option value="global">Global</Option>
        </Select>
      </Form.Item>

      {locationMode === 'global' ? (
        // Global Location Selector
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="country"
                label="Country"
              >
                <Select
                  placeholder="Select country"
                  showSearch
                  allowClear
                  onChange={handleCountryChange}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={countries}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="state"
                label="State/Province"
              >
                <Select
                  placeholder="Select state"
                  showSearch
                  allowClear
                  disabled={!selectedCountry}
                  onChange={handleStateChange}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={states}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="City"
              >
                <Select
                  placeholder="Select city"
                  showSearch
                  allowClear
                  disabled={!selectedState}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={cities}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      ) : (
        // India-specific Location Selector
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="states"
                label="States"
              >
                <Select
                  mode="multiple"
                  placeholder="Select states"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={indianStates}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="cities"
                label="Cities"
              >
                <Select
                  mode="multiple"
                  placeholder="Select cities"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={indianCities}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pincodes"
                label="Pincodes"
              >
                <Select
                  mode="multiple"
                  placeholder="Select pincodes"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={indianPincodes}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
