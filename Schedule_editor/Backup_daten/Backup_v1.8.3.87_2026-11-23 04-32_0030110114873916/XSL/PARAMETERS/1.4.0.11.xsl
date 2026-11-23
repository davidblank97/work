<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<param id="265018">
				<name>MINIMUM CURRENT</name>
				<short_name></short_name>
				<desc>N/A</desc>
			</param>
			<param id="265019">
				<name>MAXIMUM CURRENT</name>
				<short_name></short_name>
				<desc>N/A</desc>
			</param>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/Parameters[@localeID='en-CA']/param[@id='265013']">
		<param id="265013">
			<name>LAYER DIAMETER</name>
			<short_name>LAYER DIAMETER</short_name>
			<desc>Diameter of the pipe the travel track is mounted on</desc>
		</param>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>