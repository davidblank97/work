<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="iomap/metadata">
		<xsl:copy-of select="."/>
		  <firmware_version>
			<control_board>2.27.0</control_board>
			<servo_board>2.30.0</servo_board>
			<stepper_board>1.7.0</stepper_board>
		  </firmware_version>
	</xsl:template>
	
	<xsl:template match="iomap/system/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		<control_board_firmware_revision offset="113"/>
		<servo_board_firmware_revision offset="114"/>
		<stepper_board_firmware_revision offset="115"/>
	</xsl:template>

	<!-- Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>