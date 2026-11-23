<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	
	<xsl:template match="iomap/digital_servo[@index='0']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="43" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="43" bit="0" mask="0x8000"/>
		<open_loop_direction offset="43" bit="1" mask="0x8000"/>
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='1']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="44" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="44" bit="0" mask="0x8000"/>
		<open_loop_direction offset="44" bit="1" mask="0x8000"/>
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='2']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="45" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="45" bit="0" mask="0x8000"/>
		<open_loop_direction offset="45" bit="1" mask="0x8000"/>
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='3']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="46" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="46" bit="0" mask="0x8000"/>
		<open_loop_direction offset="46" bit="1" mask="0x8000"/>
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='4']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="47" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="47" bit="0" mask="0x8000"/>
		<open_loop_direction offset="47" bit="1" mask="0x8000"/>
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='5']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="48" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="48" bit="0" mask="0x8000"/>
		<open_loop_direction offset="48" bit="1" mask="0x8000"/>
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='6']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="49" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="49" bit="0" mask="0x8000"/>
		<open_loop_direction offset="49" bit="1" mask="0x8000"/>
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='7']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<open_loop_duty offset="50" mask="0x7000" digital_high="2800" digital_low="0" analog_high="100" analog_low="0"/>
		<open_loop_enable offset="50" bit="0" mask="0x8000"/>
		<open_loop_direction offset="50" bit="1" mask="0x8000"/>
	</xsl:template>
	
	<!-- Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>