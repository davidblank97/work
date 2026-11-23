<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/iomap/firmware_version/servo_board">
		<xsl:copy>
			<xsl:value-of select="'2.31.3'"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="/iomap/firmware_version/stepper_board">
		<xsl:copy>
			<xsl:value-of select="'1.8.1'"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='0']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='0']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="43" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='1']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='1']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="44" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/iomap/digital_servo[@index='2']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='2']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="45" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/iomap/digital_servo[@index='3']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='3']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="46" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/iomap/digital_servo[@index='4']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='4']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="47" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/iomap/digital_servo[@index='5']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='5']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="48" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/iomap/digital_servo[@index='6']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='6']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="49" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>	
	
	<xsl:template match="/iomap/digital_servo[@index='7']/io[@module='JASPER']/acceleration">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/digital_servo[@index='7']/io[@module='JASPER']/brake_relay"/>
			<xsl:otherwise>
				<brake_relay offset="50" bit="4" mask="0x3000"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/iomap/system/io/properties/canbus_address">
		<device_address>
			<xsl:value-of select="."/>
		</device_address>
	</xsl:template>

	<xsl:template match="/iomap/system/io[@module='COPLEY']/properties/read_input_period_ms">
		<read_input_period_ms>200</read_input_period_ms>
	</xsl:template>

	<xsl:template match="/iomap/system/io[@module='ICPDAS']/properties/read_input_period_ms">
		<read_input_period_ms>200</read_input_period_ms>
	</xsl:template>

	<xsl:template match="/iomap/gas_controller/io[@module='JASPER']/shield_flow_rate">
		<shield_flow_rate offset="27" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"  />
	</xsl:template>

	<xsl:template match="/iomap/gas_controller/io[@module='JASPER']/trail_flow_rate">
		<trail_flow_rate offset="29" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"  />
	</xsl:template>

	<xsl:template match="/iomap/gas_controller/io[@module='JASPER']/plasma_enable">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/iomap/gas_controller/io[@module='JASPER']/plasma_flow_rate"/>
			<xsl:otherwise>
				<plasma_flow_rate offset="28" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"  />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_2">
		<spare_analog_input_2 offset="21" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"/>
		<xsl:choose>
			<xsl:when test="/iomap/spares/io[@module='JASPER']/spare_analog_input_3"/>
			<xsl:otherwise>
				<spare_analog_input_3 offset="22" analog_high="10" analog_low="-10" digital_high="0" digital_low="4095"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_4/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_5/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_6/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_7/@digital_low">  
		<xsl:attribute name="digital_low">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_8"/>
	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_9"/>
	<xsl:template match="/iomap/spares/io[@module='JASPER']/spare_analog_input_10"/>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>