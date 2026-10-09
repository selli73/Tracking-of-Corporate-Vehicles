import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsLatitude, IsLongitude, IsString, Length, ValidateNested } from "class-validator";

export class PointDto {
    @ApiProperty({ description: 'Latitude (geographic coordinate)', example: 55.43 })
    @IsLatitude()
    lat: number;

    @ApiProperty({ description: 'Longitude (geographic coordinate)', example: 37.54 })
    @IsLongitude()
    lng: number;
}

export class CreateGeofenceDto {
    @IsString()
    @Length(1, 100)
    @ApiProperty({ description: 'Zone name', example: 'Moscow City' })
    name: string;

    @IsArray()
    @ArrayMinSize(4)
    @ArrayMaxSize(500)
    @ValidateNested({ each: true })
    @Type(() => PointDto)
    @ApiProperty({ type: () => [PointDto] })
    polygon: PointDto[];
}