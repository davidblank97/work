<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/digital_servo[@index='0']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="43" bit="5" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='1']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="44" bit="5" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='2']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="45" bit="5" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='3']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="46" bit="5" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='4']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="47" bit="5" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='5']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="48" bit="5" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='6']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="49" bit="5" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='7']/io[@module='JASPER']/brake_relay">
		<xsl:copy-of select="."/>
		<reverse_velocity_telemetry offset="50" bit="5" mask="0x3000"/>
	</xsl:template>
	<xsl:template match="iomap/system/io[@module='ADAM']/properties/read_input_period_ms">
		<read_input_period_ms>50</read_input_period_ms>
	</xsl:template>
	<xsl:template match="iomap/system/io[@module='ADAM']/chopper_fault">
		<chopper_fault offset="16" bit="7" checkType='1'/>
	</xsl:template>
	<xsl:template match="iomap/system/io[@module='ADAM']/motion_pulse_setpoint">
		<motion_pulse_setpoint offset="27" />
	</xsl:template>
	<xsl:template match="iomap/auxiliary_power[@index='1']/io[@module='ADAM']/amperage_primary_setpoint">
		<amperage_primary_setpoint offset="25" />		
	</xsl:template>
	<xsl:template match="iomap/auxiliary_power[@index='1']/io[@module='ADAM']/amperage_background_setpoint">
		<amperage_background_setpoint offset="25" />
	</xsl:template>
	<xsl:template match="iomap/auxiliary_power[@index='2']/io[@module='ADAM']/amperage_primary_setpoint">
		<amperage_primary_setpoint offset="26" />		
	</xsl:template>
	<xsl:template match="iomap/auxiliary_power[@index='2']/io[@module='ADAM']/amperage_background_setpoint">
		<amperage_background_setpoint offset="26" />
	</xsl:template>


	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>