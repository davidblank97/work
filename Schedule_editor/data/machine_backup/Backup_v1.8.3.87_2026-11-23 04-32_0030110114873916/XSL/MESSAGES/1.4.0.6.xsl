<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='CAL']/str[@id='23']">
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/language[@fileType='CAL']/str[@id='24']"/>
			<xsl:otherwise>
				<str id="24">
					<text>The %1 axis does not support diameter calibration.</text>
					<desc>%1 = axis name.</desc>
				</str>
				<str id="25">
					<text>No calibration required for flat track.</text>
					<desc>N/A</desc>
				</str>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>