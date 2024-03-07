import { it, describe, expect } from 'vitest';
import { ApiResponse } from '../../src/utils/ApiResponse';

describe('ApiResponse', () => {
  it('should return a status code and data equal to status code and data passed while creating instance', () => {
    // arrange
    const statusCode = 200;
    const data = {};

    // act
    const instance = new ApiResponse(statusCode, data);

    // assert
    expect(instance.statusCode).toBe(200);
    expect(instance.data).toStrictEqual({});
    // expect(instance.success).toBeTruthy();
  });

  it('should return success false when status code is above or equal to 400', () => {
    //arrange
    const statusCode = 400;

    // act
    const instance = new ApiResponse(statusCode, {});

    // assert
    expect(instance.success).toBeFalsy();
  });

  it('should return success true when status code is less than 400', () => {
    // arrange
    const statusCode = 300;
    const data = {};

    // act
    const instance = new ApiResponse(statusCode, data);

    // assert
    expect(instance.success).toBeTruthy();
  });

  it('should return message as Success if no message is pass', () => {
    // arrange
    const statusCode = 200;
    const data = {};

    // act
    const instance = new ApiResponse(statusCode, data);

    // assert
    expect(instance.message).toBe('Success');
  });

  it('should return message equal to message passed while creating instance', () => {
    // arrange
    const statusCode = 400;
    const data = {};
    const message = 'Failed';

    // act
    const instance = new ApiResponse(statusCode, data, message);

    // assert
    expect(instance.message).toBe(message);
  });
});
