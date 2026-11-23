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
	
	<xsl:template match="/language[@fileType='DEV']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
				<str id="42">
					<text>Shield Gas MFC is not OEM calibrated.</text>
					<desc>Shield Gas MFC was calibrated locally instead of by the MFC manufacturer.</desc>
				</str>
				<str id="43">
					<text>Shield Gas MFM is not OEM calibrated.</text>
					<desc>Shield Gas MFM was calibrated locally instead of by the MFM manufacturer.</desc>
				</str>
				<str id="44">
					<text>Trail Gas MFC is not OEM calibrated.</text>
					<desc>Trail Gas MFC was calibrated locally instead of by the MFC manufacturer.</desc>
				</str>
				<str id="45">
					<text>Trail Gas MFM is not OEM calibrated.</text>
					<desc>Trail Gas MFM was calibrated locally instead of by the MFM manufacturer.</desc>
				</str>
				<str id="46">
					<text>Backup Gas MFC is not OEM calibrated.</text>
					<desc>Backup Gas MFC was calibrated locally instead of by the MFC manufacturer.</desc>
				</str>
				<str id="47">
					<text>Backup Gas MFM is not OEM calibrated.</text>
					<desc>Backup Gas MFM was calibrated locally instead of by the MFM manufacturer.</desc>
				</str>
				<str id="48">
					<text>Plasma Gas MFC is not OEM calibrated.</text>
					<desc>Plasma Gas MFC was calibrated locally instead of by the MFC manufacturer.</desc>
				</str>
				<str id="49">
					<text>Plasma Gas MFM is not OEM calibrated.</text>
					<desc>Plasma Gas MFM was calibrated locally instead of by the MFM manufacturer.</desc>
				</str>
		</xsl:copy>
  	</xsl:template>  
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>