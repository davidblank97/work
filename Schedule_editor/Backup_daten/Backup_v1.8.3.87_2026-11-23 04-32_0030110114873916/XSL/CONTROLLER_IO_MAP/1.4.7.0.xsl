<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/firmware_version/servo_board">
		<xsl:copy>
			<xsl:value-of select="'2.31.3'"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='0']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="43" bit="4" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='1']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="44" bit="4" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='2']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="45" bit="4" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='3']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="46" bit="4" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='4']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="47" bit="4" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='5']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="48" bit="4" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='6']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="49" bit="4" mask="0x3000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='7']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<brake_relay offset="50" bit="4" mask="0x3000"/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>