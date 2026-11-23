<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<!-- using plasma_flow_rate to indicate it is not the pre rev 7 io map file since not included in older revs -->
	<xsl:template match="/iomap/power/io[@module='JASPER']/amperage_telemetry_input">
		<xsl:choose>
			<xsl:when test="/iomap/gas_controller/io[@module='JASPER']/plasma_flow_rate">
				<avc_sense_connector_select offset="37" bit="12" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<!-- using plasma_flow_rate to indicate it is not the pre rev 7 io map file since not included in older revs -->
	<xsl:template match="/iomap/firmware_version/control_board">
		<xsl:choose>
			<xsl:when test="/iomap/gas_controller/io[@module='JASPER']/plasma_flow_rate">
				<control_board>2.27.6</control_board>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of select="."/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="/iomap/wire_manipulator/io[@module='JASPER']/side_switch">
		<xsl:copy-of select="."/>
		<servo_side_switch offset="38" bit="6" />
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>