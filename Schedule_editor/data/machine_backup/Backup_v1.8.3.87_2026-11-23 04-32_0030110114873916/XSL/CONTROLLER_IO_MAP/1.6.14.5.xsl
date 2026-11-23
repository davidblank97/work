<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/iomap/firmware_version/servo_board">
		<xsl:copy>
			<xsl:value-of select="'2.31.10'"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='0']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="43" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='1']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="44" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='2']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="45" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='3']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="46" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='4']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="47" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='5']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="48" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='6']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="49" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="/iomap/digital_servo[@index='7']/io[@module='JASPER']/reverse_velocity_telemetry">
		<xsl:copy-of select="."/>
		<current_component offset="50" mask="0xB000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>